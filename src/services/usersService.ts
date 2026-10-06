import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import type { UserItem } from "../types/people";

import { MALE_AVATARS, FEMALE_AVATARS, DEFAULT_AVATAR } from "../utils/avatars";

const COLLECTION_NAME = "users";

export function generateUserId(existing: UserItem[]): string {
  let counter = 1001;
  let code = `USR-${counter}`;
  const existingCodes = new Set(existing.map(u => (u.userId || '').toUpperCase()));

  while (existingCodes.has(code.toUpperCase())) {
    counter++;
    code = `USR-${counter}`;
  }
  return code;
}

// Seed initial users if database is empty
const SEED_USERS: Omit<UserItem, "id">[] = [
  {
    userId: "USR-1001",
    userName: "Varatharajan R",
    email: "varathan@retailx.io",
    phoneNumber: "+91 9876543210",
    password: "Password@123",
    roleId: "ROL-1001",
    roleName: "Administrator",
    isActive: true,
    timeFormat: "12-hour (hh:mm A)",
    timeZone: "IST (Asia/Kolkata - UTC+05:30)",
    profilePic: MALE_AVATARS[0].url,
    createdAt: new Date().toISOString()
  },
  {
    userId: "USR-1002",
    userName: "Priya Sharma",
    email: "priya.sharma@retailx.io",
    phoneNumber: "+91 9123456789",
    password: "ManagerSecret#99",
    roleId: "ROL-1002",
    roleName: "Store Manager",
    isActive: true,
    timeFormat: "24-hour (HH:mm)",
    timeZone: "IST (Asia/Kolkata - UTC+05:30)",
    profilePic: FEMALE_AVATARS[0].url,
    createdAt: new Date().toISOString()
  }
];

/**
 * Validate email format using standard RFC email regex
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate 10-digit Indian phone number
 */
export function validatePhone10Digits(phone: string): boolean {
  const clean = phone.replace(/\D/g, '');
  return clean.length === 10;
}

/**
 * Check if email is unique (case-insensitive)
 */
export function isEmailUnique(email: string, existing: UserItem[], excludeId?: string): boolean {
  const norm = email.trim().toLowerCase();
  return !existing.some(u => u.email.trim().toLowerCase() === norm && u.id !== excludeId);
}

export function subscribeUsers(onData: (items: UserItem[]) => void, onError?: (err: Error) => void) {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          console.log("Users collection empty. Seeding initial users...");
          try {
            for (const item of SEED_USERS) {
              await addDoc(collection(db, COLLECTION_NAME), {
                ...item,
                createdAt: serverTimestamp()
              });
            }
          } catch (seedErr) {
            console.error("Error seeding initial users:", seedErr);
          }
          return;
        }

        let defaultUserCounter = 1001;
        const items: UserItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let createdAtStr = new Date().toISOString();
          if (data.createdAt?.toDate) {
            createdAtStr = data.createdAt.toDate().toISOString();
          } else if (typeof data.createdAt === "string") {
            createdAtStr = data.createdAt;
          }

          let picUrl = data.profilePic || DEFAULT_AVATAR;
          if (picUrl.startsWith('data:image/svg+xml')) {
            picUrl = DEFAULT_AVATAR;
          }
          const assignedUserId = data.userId || `USR-${defaultUserCounter++}`;

          return {
            id: docSnap.id,
            userId: assignedUserId,
            userName: data.userName || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            password: data.password || "",
            roleId: data.roleId || "",
            roleName: data.roleName || "Unassigned",
            isActive: data.isActive !== undefined ? data.isActive : true,
            timeFormat: data.timeFormat || "12-hour (hh:mm A)",
            timeZone: data.timeZone || "IST (Asia/Kolkata - UTC+05:30)",
            profilePic: picUrl,
            createdAt: createdAtStr
          };
        });

        onData(items);
      },
      (err) => {
        console.error("Firestore users subscription error:", err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup users listener:", err);
    if (onError) onError(err);
    return () => {};
  }
}

export async function addUserToDb(item: Omit<UserItem, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    userId: item.userId.trim(),
    userName: item.userName.trim(),
    email: item.email.trim().toLowerCase(),
    phoneNumber: item.phoneNumber.trim(),
    password: item.password,
    roleId: item.roleId,
    roleName: item.roleName,
    isActive: item.isActive,
    timeFormat: item.timeFormat,
    timeZone: item.timeZone,
    profilePic: item.profilePic.trim(),
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function deleteUserFromDb(id: string): Promise<void> {
  if (!id) throw new Error("Document ID required");
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function updateUserInDb(id: string, item: Partial<UserItem>): Promise<void> {
  if (!id) throw new Error("Document ID required for update");
  const docRef = doc(db, COLLECTION_NAME, id);
  const updateData: any = {};
  if (item.userId !== undefined) updateData.userId = item.userId.trim();
  if (item.userName !== undefined) updateData.userName = item.userName.trim();
  if (item.email !== undefined) updateData.email = item.email.trim().toLowerCase();
  if (item.phoneNumber !== undefined) updateData.phoneNumber = item.phoneNumber.trim();
  if (item.password !== undefined) updateData.password = item.password;
  if (item.roleId !== undefined) updateData.roleId = item.roleId;
  if (item.roleName !== undefined) updateData.roleName = item.roleName;
  if (item.isActive !== undefined) updateData.isActive = item.isActive;
  if (item.timeFormat !== undefined) updateData.timeFormat = item.timeFormat;
  if (item.timeZone !== undefined) updateData.timeZone = item.timeZone;
  if (item.profilePic !== undefined) updateData.profilePic = item.profilePic.trim();

  await updateDoc(docRef, updateData);
}
