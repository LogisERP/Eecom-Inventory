export interface RoleItem {
  id?: string;             // Firestore doc ID
  roleName: string;        // Mandatory, unique
  roleId: string;          // Autonumber unique mandatory (e.g. ROL-1001)
  isActive: boolean;       // Default true
  createdAt?: string;
}

export interface UserItem {
  id?: string;             // Firestore doc ID
  userName: string;        // Mandatory
  email: string;           // Mandatory, unique, regex validated
  phoneNumber: string;     // +91 default readonly + 10 digits
  password: string;        // Hidden/masked after save
  roleId: string;          // Linked Role ID or Role Name
  roleName: string;        // Role Name looked up
  isActive: boolean;       // Default true
  timeFormat: string;      // Mandatory dropdown
  timeZone: string;        // Mandatory dropdown
  profilePic: string;      // Mandatory. Git file server path / image URL
  createdAt?: string;
}
