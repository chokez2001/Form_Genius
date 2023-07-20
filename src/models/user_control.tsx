import {
  GoogleAuthProvider,
  OAuthCredential,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,

} from "firebase/auth";
import {
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import {firestore_db, app } from "./firebase_conecction";
import { useAuthState } from "react-firebase-hooks/auth";

const auth = getAuth(app);




const logInWithEmailAndPassword = async (email: string, password: string): Promise<string | null> => {
  try {
    // Iniciar sesión con el email y contraseña proporcionados
    const res = await signInWithEmailAndPassword(auth, email, password);

    if (res.user) {
      // El usuario ha iniciado sesión exitosamente
      // Puedes redirigir al usuario a la página deseada aquí
      return null; // No hay error, devolvemos null
    } else {
      // Si el usuario es nulo, mostrar un mensaje de error
      return "Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde.";
    }
  } catch (error) {
    // Manejar diferentes tipos de errores de inicio de sesión
    const errorCode = (error as any)?.code;
    switch (errorCode) {
      case "auth/wrong-password":
        return "Contraseña incorrecta. Por favor, verifica tus credenciales.";
      case "auth/user-not-found":
        return "No se encontró ningún usuario con este correo electrónico. Por favor, verifica tus credenciales.";
      case "auth/invalid-email":
        return "El correo electrónico proporcionado no es válido. Por favor, verifica tus credenciales.";
      default:
        return "Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo más tarde.";
    }
  }
};




const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    // Crear el usuario con el email y contraseña proporcionados
    const res = await createUserWithEmailAndPassword(auth, email, password);

    // Obtener el usuario creado
    const user = res.user;

    // Agregar el usuario a la colección "users" con los datos adicionales
    await addDoc(collection(firestore_db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });

    // Enviar el correo de verificación
    await sendEmailVerification(user);


    // Registro exitoso, mostrar mensaje de éxito en la alerta
    alert("Registro exitoso. Por favor, verifica tu correo electrónico antes de iniciar sesión.");
  } catch (err) {
    console.error(err);
  }
};

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico.");
  } catch (err) {
    console.error(err);
    alert((err as Error).message);
  }
};




const logout = () => {
  signOut(auth);
};




// const signInWithGoogle = async () => {
//   try {
//     const provider = new GoogleAuthProvider();
//     provider.addScope("profile");
//     provider.addScope("email");

//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;
//     const credential = GoogleAuthProvider.credentialFromResult(
//       result
//     ) as OAuthCredential | null;

//     if (user && credential) {
//       const q = query(
//         collection(firestore_db, "users"),
//         where("uid", "==", user.uid)
//       );
//       const docs = await getDocs(q);

//       if (docs.docs.length === 0) {
//         await addDoc(collection(firestore_db, "users"), {
//           uid: user.uid,
//           name: user.displayName,
//           authProvider: "google",
//           email: user.email,
//         });
//       }
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Error al iniciar sesión con Google");
//   }
// };




export {
  auth,
  // signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
