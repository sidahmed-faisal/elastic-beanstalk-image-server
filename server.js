import express, { Router} from 'express';
import bodyParser from 'body-parser';
import {validURL,filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage",async (req , res) =>{

    if (
      typeof req.query.image_url === 'string'
    ){
      const imageURL = req.query.image_url
      
      if (!validURL(imageURL)) {
        return res
          .status(422)
          .send({ error: 'image_url is not a valid image' })
      }

      try {
        const image = await filterImageFromURL(imageURL)
        return res.sendFile(image, async () => {
          await deleteLocalFiles([image])
        })
      } catch (error) {
        return res
          .status(422)
          .send({ error: 'This URL is not for an image' })
      }
    } else {
      res.status(400).send({ error: 'image_url is invalid' })
    }
  }
)


  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
