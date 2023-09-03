const io=require('socket.io')(3001,{
    cors:{origin:'http://localhost:3000',
methods:['GET','POST']}
})
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const client = CloudantV1.newInstance({});
const dbName = 'qawsed';
// console.log(client)


const defaultValue=""
io.on('connection',socket=>{
    console.log("Connected")

    // socket.on('get-document',socket=>{
        socket.on('get-document',async documentId=>{
            const document = await findOrCreateDocument(documentId)
            socket.join(documentId)
            socket.emit('load-document',document.data)
    
            socket.on("send-changes",delta=>{
                socket.broadcast.to(documentId).emit("receive-changes",delta)
            })
            socket.on('save-document',async data=>{
                await findOrUpdateDocument(documentId,data)
            })
        })
    // })
    socket.on('disconnect', () => {
        console.log("A user disconnected"); // Log when a user disconnects
    });
})

async function findOrCreateDocument(id){
    if(id==null) return

    try{
        const getDocumentResponse = await client.getDocument({
            db: dbName,
            docId: id,
        });
        const existingDocument = getDocumentResponse.result;
        console.log('Document already exists:', existingDocument.data);
        return existingDocument.data
    }
    catch(err){
        if(err.code===404){
            const newDocument = {
                _id: id,
                data:defaultValue
            };

            try {
                const createDocumentResponse = await client.postDocument({
                    db: dbName,
                    document: newDocument,
                });

                if (createDocumentResponse.result.ok) {
                    console.log('Document added successfully:', newDocument);
                    return newDocument
                }
            } catch (createErr) {
                console.error('Error adding document:', createErr.message);
            }

        }
        else{
            console.error('Error fetching document:', err.message);
        }
    }

}


async function findOrUpdateDocument(id,data){
    if (id==null) return

    try{
        const getDocumentResponse = await client.getDocument({
            db: dbName,
            docId: id,
        });
        const existingDocument = getDocumentResponse.result;
        console.log('Document already exists:', existingDocument.data,"_",data);
        // return existingDocument.data
        existingDocument.data = data;
        try {
            const updateDocumentResponse = await client.putDocument({
                db: dbName,
                docId: id,
                document: existingDocument,
            });

            if (updateDocumentResponse.result.ok) {
                console.log('Document updated successfully:', existingDocument);
                return existingDocument
            }
        } catch (updateErr) {
            console.error('Error updating document:', updateErr.message);
        }
    }
    catch(err){
        console.error('Error fetching document:', err.message)
    }

}
// const data={
//     property1: '....',
// }
// findOrCreateDocument("SudalaMaada_Kaapathu");
// findOrUpdateDocument("Just_testing",data)



