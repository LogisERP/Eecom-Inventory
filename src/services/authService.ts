import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { UserItem } from "../types/people";
import { DEFAULT_AVATAR } from "../utils/avatars";

const AUTH_STORAGE_KEY = "retail_x_authenticated_user";

/**
 * Format phone input to standard "+91 XXXXXXXXXX" format
 */
export function formatPhoneNumberInput(digitsOrPhone: string): string {
  const cleanDigits = digitsOrPhone.replace(/\D/g, "");
  // If user entered 12 digits starting with 91, strip 91
  if (cleanDigits.length === 12 && cleanDigits.startsWith("91")) {
    return `+91 ${cleanDigits.slice(2)}`;
  }
  if (cleanDigits.length === 10) {
    return `+91 ${cleanDigits}`;
  }
  return digitsOrPhone.trim();
}

/**
 * Authenticate user against Firestore "users" collection by Phone Number & Password
 */
export async function authenticateUser(phoneInput: string, passwordInput: string): Promise<UserItem> {
  const formattedPhone = formatPhoneNumberInput(phoneInput);

  if (!phoneInput.trim()) {
    throw new Error("Phone Number is mandatory.");
  }
  if (!passwordInput) {
    throw new Error("Password is mandatory.");
  }

  try {
    const usersRef = collection(db, "users");
    // Query users matching phone number
    const q = query(usersRef, where("phoneNumber", "==", formattedPhone));
    const snapshot = await getDocs(q);

    let matchedDoc: any = null;

    if (!snapshot.empty) {
      matchedDoc = snapshot.docs[0];
    } else {
      // Fallback fallback: search all users in case formatting differs (+91 prefix vs raw digits)
      const allSnapshot = await getDocs(usersRef);
      const cleanInputDigits = phoneInput.replace(/\D/g, "");
      const found = allSnapshot.docs.find((d) => {
        const data = d.data();
        const userPhoneDigits = (data.phoneNumber || "").replace(/\D/g, "");
        return userPhoneDigits.endsWith(cleanInputDigits) || cleanInputDigits.endsWith(userPhoneDigits);
      });
      if (found) {
        matchedDoc = found;
      }
    }

    if (!matchedDoc) {
      throw new Error("Invalid Phone Number or Password. Account not found.");
    }

    const userData = matchedDoc.data();

    // Verify Password
    if (userData.password !== passwordInput) {
      throw new Error("Invalid Phone Number or Password.");
    }

    // Verify Account Active state
    if (userData.isActive === false) {
      throw new Error("Your account has been deactivated. Please contact your system administrator.");
    }

    let createdAtStr = new Date().toISOString();
    if (userData.createdAt?.toDate) {
      createdAtStr = userData.createdAt.toDate().toISOString();
    } else if (typeof userData.createdAt === "string") {
      createdAtStr = userData.createdAt;
    }

    let finalUserId = userData.userId;
    if (!finalUserId) {
      try {
        const allUsersSnap = await getDocs(usersRef);
        const existingUserIds = new Set(allUsersSnap.docs.map((d) => ((d.data().userId || '') as string).toUpperCase()));
        let counter = 1001;
        let candidate = `USR-${counter}`;
        while (existingUserIds.has(candidate)) {
          counter++;
          candidate = `USR-${counter}`;
        }
        finalUserId = candidate;
        const userDocRef = doc(db, "users", matchedDoc.id);
        await updateDoc(userDocRef, { userId: finalUserId });
      } catch (e) {
        console.warn("Could not write missing userId to Firestore during auth:", e);
        finalUserId = "USR-1001";
      }
    }

    let userProfilePic = userData.profilePic || DEFAULT_AVATAR;
    if (userProfilePic.startsWith("data:image/svg+xml")) {
      userProfilePic = DEFAULT_AVATAR;
    }

    const authenticatedUser: UserItem = {
      id: matchedDoc.id,
      userId: finalUserId,
      userName: userData.userName || "User",
      email: userData.email || "",
      phoneNumber: userData.phoneNumber || formattedPhone,
      password: userData.password || "",
      roleId: userData.roleId || "",
      roleName: userData.roleName || "User",
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      timeFormat: userData.timeFormat || "12-hour (hh:mm A)",
      timeZone: userData.timeZone || "IST (Asia/Kolkata - UTC+05:30)",
      profilePic: userProfilePic,
      createdAt: createdAtStr,
    };

    setStoredAuthUser(authenticatedUser);
    return authenticatedUser;
  } catch (err: any) {
    console.error("Authentication failed:", err);
    throw new Error(err.message || "Failed to authenticate. Please check your network and credentials.");
  }
}

/**
 * Retrieve current logged-in user from localStorage/sessionStorage
 */
export function getStoredAuthUser(): UserItem | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserItem;
  } catch {
    return null;
  }
}

/**
 * Store logged in user into local or session storage
 */
export function setStoredAuthUser(user: UserItem | null, rememberMe = true): void {
  try {
    if (!user) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      return;
    }
    const val = JSON.stringify(user);
    if (rememberMe) {
      localStorage.setItem(AUTH_STORAGE_KEY, val);
    } else {
      sessionStorage.setItem(AUTH_STORAGE_KEY, val);
    }
  } catch (err) {
    console.error("Failed to store auth user:", err);
  }
}

/**
 * Log out user and clear stored auth state
 */
export function logoutUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
