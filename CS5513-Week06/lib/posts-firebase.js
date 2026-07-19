// Import the Firebase app instance
import { db } from './firebase';
import { collection, getDocs, query, where, documentId } from 'firebase/firestore';


export async function getSortedPostsData() {
    const myCollectionRef =  collection( db, "posts" );
    const querySnapshot = await getDocs( myCollectionRef );
    const jsonObject = querySnapshot.docs.map ( doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort all data based on title properties
    jsonObject.sort(function (a, b) {
        return a.title.localeCompare(b.title);
    });

    // Return reconfigured array organized by id converted to a string
    return jsonObject.map(item => {
        return {
            id: item.id.toString(),
            title: item.title,
            date: item.date,
            featured_image: item.featured_image
        }
    });
}


export async function getAllPostIds() {
    const myCollectionRef =  collection( db, "posts" );
    const querySnapshot = await getDocs( myCollectionRef );
    const jsonObject = querySnapshot.docs.map ( doc => ({ id: doc.id }));

    return jsonObject.map(item => {
        return {
            params: {
                id: item.id.toString()
            }
        }
    });
}


export async function getPostData(id) {
    const myCollectionRef =  collection( db, "posts" );
    const searchQuery = query(
        myCollectionRef,
        where(
            documentId(),
            "==",
            id
        )
    );
    const querySnapshot = await getDocs( searchQuery );
    const jsonObject = querySnapshot.docs.map ( doc => ({ id: doc.id, ...doc.data() }));

    if (jsonObject.length === 0) {
        return {
            "id": id,
            "title": 'Not found',
            "date": '',
            "contentHtml": 'Not found',
            "category": 'Not found',
            "featured_image": 'Not found',
        }
    } else {
        return jsonObject[0];
    }
}