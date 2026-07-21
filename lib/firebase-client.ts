"use client";

export type FirebaseSessionUser = {
  uid: string;
  displayName: string;
  email: string;
  emailVerified: boolean;
};

type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  getIdToken(forceRefresh?: boolean): Promise<string>;
  reload(): Promise<void>;
};

type FirebaseAuth = {
  currentUser: FirebaseUser | null;
  useDeviceLanguage(): void;
};

type FirebaseAppModule = {
  getApp(): object;
  getApps(): object[];
  initializeApp(options: Record<string, string>): object;
};

type FirebaseAuthModule = {
  getAuth(app: object): FirebaseAuth;
  onAuthStateChanged(
    auth: FirebaseAuth,
    callback: (user: FirebaseUser | null) => void,
  ): () => void;
  createUserWithEmailAndPassword(
    auth: FirebaseAuth,
    email: string,
    password: string,
  ): Promise<{ user: FirebaseUser }>;
  signInWithEmailAndPassword(
    auth: FirebaseAuth,
    email: string,
    password: string,
  ): Promise<{ user: FirebaseUser }>;
  signOut(auth: FirebaseAuth): Promise<void>;
  sendEmailVerification(user: FirebaseUser): Promise<void>;
  sendPasswordResetEmail(auth: FirebaseAuth, email: string): Promise<void>;
};

type FirestoreDocument = {
  id: string;
  data(): Record<string, unknown>;
};

type FirebaseFirestoreModule = {
  getFirestore(app: object): object;
  collection(database: object, ...segments: string[]): object;
  doc(database: object, ...segments: string[]): object;
  getDocs(reference: object): Promise<{ docs: FirestoreDocument[] }>;
  setDoc(reference: object, data: object, options?: { merge: boolean }): Promise<void>;
  deleteDoc(reference: object): Promise<void>;
};

type FirebaseModules = {
  app: FirebaseAppModule;
  auth: FirebaseAuthModule;
  firestore: FirebaseFirestoreModule;
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
};

let modulesPromise: Promise<FirebaseModules> | null = null;

const FIREBASE_APP_MODULE = "/firebase/firebase-app.js";
const FIREBASE_AUTH_MODULE = "/firebase/firebase-auth.js";
const FIREBASE_FIRESTORE_MODULE = "/firebase/firebase-firestore.js";

function loadFirebaseModules(): Promise<FirebaseModules> {
  if (!modulesPromise) {
    modulesPromise = Promise.all([
      import(/* @vite-ignore */ FIREBASE_APP_MODULE),
      import(/* @vite-ignore */ FIREBASE_AUTH_MODULE),
      import(/* @vite-ignore */ FIREBASE_FIRESTORE_MODULE),
    ]).then(([app, auth, firestore]) => ({
      app: app as unknown as FirebaseAppModule,
      auth: auth as unknown as FirebaseAuthModule,
      firestore: firestore as unknown as FirebaseFirestoreModule,
    }));
  }
  return modulesPromise;
}

function assertConfigured() {
  if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId ||
    !firebaseConfig.appId
  ) {
    throw new Error("Firebase public configuration is missing.");
  }
}

async function getFirebaseServices() {
  assertConfigured();
  const modules = await loadFirebaseModules();
  const app = modules.app.getApps().length
    ? modules.app.getApp()
    : modules.app.initializeApp(firebaseConfig);
  const auth = modules.auth.getAuth(app);
  auth.useDeviceLanguage();

  return {
    modules,
    auth,
    database: modules.firestore.getFirestore(app),
  };
}

function toSessionUser(user: FirebaseUser | null): FirebaseSessionUser | null {
  if (!user?.email) return null;
  return {
    uid: user.uid,
    displayName: user.displayName?.trim() || user.email.split("@")[0],
    email: user.email,
    emailVerified: user.emailVerified,
  };
}

export async function observeFirebaseSession(
  callback: (user: FirebaseSessionUser | null) => void,
): Promise<() => void> {
  const { modules, auth } = await getFirebaseServices();
  return modules.auth.onAuthStateChanged(auth, (user) => callback(toSessionUser(user)));
}

export async function registerWithEmail(
  email: string,
  password: string,
): Promise<FirebaseSessionUser> {
  const { modules, auth } = await getFirebaseServices();
  const credential = await modules.auth.createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await modules.auth.sendEmailVerification(credential.user);
  return toSessionUser(credential.user) as FirebaseSessionUser;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<FirebaseSessionUser> {
  const { modules, auth } = await getFirebaseServices();
  const credential = await modules.auth.signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return toSessionUser(credential.user) as FirebaseSessionUser;
}

export async function signOutFirebase(): Promise<void> {
  const { modules, auth } = await getFirebaseServices();
  await modules.auth.signOut(auth);
}

export async function sendFirebasePasswordReset(email: string): Promise<void> {
  const { modules, auth } = await getFirebaseServices();
  await modules.auth.sendPasswordResetEmail(auth, email);
}

export async function resendFirebaseVerification(): Promise<void> {
  const { modules, auth } = await getFirebaseServices();
  if (!auth.currentUser) throw new Error("No signed-in Firebase user.");
  await modules.auth.sendEmailVerification(auth.currentUser);
}

export async function refreshFirebaseSession(): Promise<FirebaseSessionUser | null> {
  const { auth } = await getFirebaseServices();
  if (!auth.currentUser) return null;
  await auth.currentUser.reload();
  await auth.currentUser.getIdToken(true);
  return toSessionUser(auth.currentUser);
}

export async function listUserDocuments<T>(
  userId: string,
  collectionName: "recipes" | "ratings",
): Promise<T[]> {
  const { modules, database } = await getFirebaseServices();
  const snapshot = await modules.firestore.getDocs(
    modules.firestore.collection(database, "users", userId, collectionName),
  );
  return snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as T);
}

export async function saveUserDocument<T extends object>(
  userId: string,
  collectionName: "recipes" | "ratings",
  documentId: string,
  value: T,
): Promise<void> {
  const { modules, database } = await getFirebaseServices();
  await modules.firestore.setDoc(
    modules.firestore.doc(database, "users", userId, collectionName, documentId),
    value,
    { merge: true },
  );
}

export async function deleteUserDocument(
  userId: string,
  collectionName: "recipes" | "ratings",
  documentId: string,
): Promise<void> {
  const { modules, database } = await getFirebaseServices();
  await modules.firestore.deleteDoc(
    modules.firestore.doc(database, "users", userId, collectionName, documentId),
  );
}
