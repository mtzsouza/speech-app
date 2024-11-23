import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private firestore: Firestore) {} // Changing this to inject() will crash

 //   USAGE: 
 //   const data = this.database.fetchDocumentById('users', 'id').then(data => {console.log(data);})

  async addDocument(collectionName: string, data: any): Promise<string> {
    const ref = collection(this.firestore, collectionName);
    try {
      const docRef = await addDoc(ref, data);
      console.log('Data added successfully');
      return docRef.id;
    } catch (error) {
      console.error('Error adding data: ', error);
    }
    return ''
  }

  async addDocWithCustomId(collectionName: string, data: any, customId: string): Promise<void> {
    const docRef = doc(this.firestore, collectionName, customId);
    try {
      await setDoc(docRef, data);
      console.log('Data added successfully with custom ID');
    } catch (error) {
      console.error('Error adding data with custom ID: ', error);
    }
  }

  async updateField(collectionName: string, docId: string, field: string, value: any): Promise<void> {
    const docRef = doc(this.firestore, collectionName, docId);
    try {
      await updateDoc(docRef, { [field]: value });
      console.log('Field updated successfully');
    } catch (error) {
      console.error('Error updating field: ', docId, error);
    }
  }

  async fetchCollection(collectionName: string): Promise<any[]> {
    const ref = collection(this.firestore, collectionName);
    try {
      const snapshot = await getDocs(ref);
      if (snapshot.empty) {
        throw new Error(`Collection '${collectionName}' does not exist or is empty`);
      }
      const data = snapshot.docs.map(doc => doc.data());
      console.log('Collection fetched successfully');
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchDocumentById(collectionName: string, documentId: string): Promise<any | null> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        console.log('Document fetched successfully');
        return docSnapshot.data();
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error fetching document: ', error);
      return null;
    }
  }

  async deleteDocument(collectionName: string, documentId: string): Promise<void> {
    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    try {
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        deleteDoc(docRef);
        console.log("Document deleted successfully")
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  }

  async fetchUserPreferences(userId: string): Promise<{ theme: string; language: string } | null> {
    return await this.fetchDocumentById('users', userId);
  }
  
  async updateUserPreference(userId: string, field: 'theme' | 'language', value: string): Promise<void> {
    await this.updateField('users', userId, field, value);
  }
}