import { addDoc, collection, getDocs, onSnapshot} from "@firebase/firestore"
import { firestore_db } from "./firebase_conecction"
 


 const submitData = (testdata: any) => {
    const ref = collection(firestore_db, "form_genius") 
    let data = {
        testData: testdata
    }
    
    try {
        addDoc(ref, data)
        console.log("Document written with ID: ", ref.id);

    } catch(err) {
        console.log(err)
    }
}
 


const fetchData = (callback: (querySnapshot: any) => void) => {
  const collectionRef = collection(firestore_db, 'form_genius');

  const unsubscribe = onSnapshot(collectionRef, (querySnapshot) => {
    callback(querySnapshot);
  });

  return unsubscribe;
};


export  {submitData, fetchData};