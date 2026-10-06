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
import type { RoleItem } from "../types/people";

const COLLECTION_NAME = "roles";

// Seed data if roles collection is empty
const SEED_ROLES: Omit<RoleItem, "id">[] = [
  {
    roleName: "Administrator",
    roleId: "ROL-1001",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    roleName: "Store Manager",
    roleId: "ROL-1002",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    roleName: "Inventory Specialist",
    roleId: "ROL-1003",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    roleName: "Sales Associate",
    roleId: "ROL-1004",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

export function generateRoleId(existing: RoleItem[]): string {
  let counter = 1001;
  let code = `ROL-${counter}`;
  const existingCodes = new Set(existing.map(r => r.roleId.toUpperCase()));

  while (existingCodes.has(code.toUpperCase())) {
    counter++;
    code = `ROL-${counter}`;
  }
  return code;
}

export function isRoleNameUnique(name: string, existing: RoleItem[], excludeId?: string): boolean {
  const norm = name.trim().toLowerCase();
  return !existing.some(r => r.roleName.trim().toLowerCase() === norm && r.id !== excludeId);
}

export function subscribeRoles(onData: (items: RoleItem[]) => void, onError?: (err: Error) => void) {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          console.log("Roles collection empty. Seeding defaults...");
          try {
            for (const item of SEED_ROLES) {
              await addDoc(collection(db, COLLECTION_NAME), {
                ...item,
                createdAt: serverTimestamp()
              });
            }
          } catch (seedErr) {
            console.error("Error seeding initial roles:", seedErr);
          }
          return;
        }

        const items: RoleItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          let createdAtStr = new Date().toISOString();
          if (data.createdAt?.toDate) {
            createdAtStr = data.createdAt.toDate().toISOString();
          } else if (typeof data.createdAt === "string") {
            createdAtStr = data.createdAt;
          }

          return {
            id: docSnap.id,
            roleName: data.roleName || "",
            roleId: data.roleId || "",
            isActive: data.isActive !== undefined ? data.isActive : true,
            createdAt: createdAtStr
          };
        });

        onData(items);
      },
      (err) => {
        console.error("Firestore roles subscription error:", err);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.error("Failed to setup roles listener:", err);
    if (onError) onError(err);
    return () => {};
  }
}

export async function addRoleToDb(item: Omit<RoleItem, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    roleName: item.roleName.trim(),
    roleId: item.roleId.trim(),
    isActive: item.isActive,
    createdAt: serverTimestamp()
  });
  return docRef.id;
}

export async function deleteRoleFromDb(id: string): Promise<void> {
  if (!id) throw new Error("Document ID required");
  await deleteDoc(doc(db, COLLECTION_NAME, id));
}

export async function updateRoleInDb(id: string, item: Partial<RoleItem>): Promise<void> {
  if (!id) throw new Error("Document ID required");
  await updateDoc(doc(db, COLLECTION_NAME, id), {
    roleName: item.roleName?.trim(),
    roleId: item.roleId?.trim(),
    isActive: item.isActive
  });
}
