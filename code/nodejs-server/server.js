const PORT=3001
const io = require('socket.io')(PORT, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const mongoose = require("mongoose");
const Document = require("./document")
const uri = "URI";


const IBM = require('ibm-cos-sdk');

var config = {
CRENDTIALS
    
};

var s3 = new IBM.S3(config);



// Dictionary to store connected client names per document
const connectedClientsPerDocument = {};

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Db connected Successfully");
  } catch (error) {
    console.log("Error occurred: ", error);
  }
}
connectToDatabase();

const defaultValue = ""
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("Received token from client:", token);
  next();
});


io.on('connection', socket => {
  let documentId; // Define documentId variable for this connection

  socket.on('don', async (user_mail) => {
    const trimmedUserMail = user_mail.trim();
  
    try {
      const files = await Document.find({ createdBy: trimmedUserMail });
      socket.emit('docslist', files);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  });
  

  socket.on('creationReq',async (user_mail)=>{
    console.log("Bucket Creation Request",user_mail)
    const msg=await createBucket(user_mail)
    socket.emit('bucketMessage',msg)
    const objects=getBucketContents(user_mail)
    socket.emit('objectsList',objects)
  })

      socket.on("createfile", async (fileName, fileData, bname) => {
        await createFile(fileName, fileData, bname);
      });
      socket.on("displaycontent", async (bname) => {
        await getBucketContents(bname);
      });
      socket.on("bucket-creation", async bucketName=>{
        await createBucket(bucketName)
        //console.log(bucketName)
      });

      socket.on("save-button",async file=>{
        await createTextFile(file)
      })


  socket.on('get-document', async (docId, documentName) => {
    documentId = docId; // Set the documentId for this connection
    const clientName = socket.handshake.auth.token.trim();
    const document = await findOrCreateDocument(documentId, documentName, clientName)
    socket.join(documentId)
    socket.emit("load-document", document.data)
    socket.on('send-changes', delta => {
      socket.broadcast.to(documentId).emit('receive-changes', delta);
    });

    socket.on('get-user-documents', async () => {
      // const clientName = socket.handshake.auth.token.trim();
      const userDocuments = await Document.find({ createdBy: clientName });
    
      socket.emit('user-documents', userDocuments);
    });
  
    socket.on("save-document", async data => {
      const currentDate = new Date();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    
      const formattedDate = `${hours}:${minutes} / ${day}-${month}`;
      const lastModified=formattedDate
    
      await Document.findByIdAndUpdate(documentId, { data,lastModified:lastModified });
    });

    if (!connectedClientsPerDocument[documentId]) {
      connectedClientsPerDocument[documentId] = [];
    }
    connectedClientsPerDocument[documentId].push(clientName);
    io.to(documentId).emit('connected-clients', connectedClientsPerDocument[documentId]);

    socket.on('disconnect', () => {
      // Remove the client name from the list for the specific document
      if (connectedClientsPerDocument[documentId]) {
        connectedClientsPerDocument[documentId] = connectedClientsPerDocument[documentId].filter(name => name !== clientName);
        io.to(documentId).emit('connected-clients', connectedClientsPerDocument[documentId]);
      }
      console.log(connectedClientsPerDocument);
    });

    console.log('connected..');
  });

  console.log('connected..');
});


async function createBucket(bucketName) {
  console.log(`Creating new bucket: ${bucketName}`);
  const msg1='Succcessfully created the bucket 🎉'
  const msg2=`Fetching objects from the bucket ${bucketName}`
  return s3.createBucket({
    Bucket: bucketName,
    CreateBucketConfiguration: {
      LocationConstraint: 'us-south'
    },
  }).promise()
    .then(() => {
      console.log(`Bucket: ${bucketName} created!`);
      return msg1
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
      if(e.code == 'BucketAlreadyExists') return msg2
      else return e.code
    });}

async function getBucketContents(bucketName) {
  console.log(`Retrieving bucket contents from: ${bucketName}`);
  return s3.listObjects({ Bucket: bucketName })
    .promise()
    .then((data) => {
      if (data != null && data.Contents != null) {
        const contents = data.Contents.map((item) => {
          return {
            name: item.Key,
            lastModified: item.LastModified,
            size: item.Size,
          };
        });
        io.emit("bucketContentsFetched", contents);
        // console.log(contents)
        return contents;
      } else {
        return [];
      }
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}

async function findOrCreateDocument(id, name, createdBy) {
  if (id == null) return

  const document = await Document.findById(id);
  if (document) return document;

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  const formattedDate = `${hours}:${minutes} / ${day}-${month}`;
  const createdAt=formattedDate

  return await Document.create({ _id: id, name, data: defaultValue,createdBy,createdAt });
}


async function createFile(fname,file,bname) {
  console.log(`Creating new item: `);
  // var local = "C:/Users/sanja/OneDrive/Documents/dbms notes.pdf";
  // const fileStream = fs.createReadStream(local);
  // const fileName = path.basename(local);
  const testing= s3.putObject({
    Bucket:bname, 
    Key:fname, 
    Body: file,
  })
  console.log(testing)
  return testing.promise()
  .then((print) => {
      console.log(print)
      console.log(`Item:created!`);
  })
  .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
  });
}