import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [folderPath, setFolderPath] = useState(null);
  const [images, setImages] = useState([]);
  const [displayImage, setDisplayImage] = useState([]);

  const handleFolderChange = (event) => {
    const selectedFolder = event.target.files[0].path;
    console.log(selectedFolder);
    if (selectedFolder) {
      window.electron.ipcRenderer.send("folder-path", selectedFolder);
      setFolderPath(selectedFolder);
    }
  };

  const handleImageClick = (imageName) => {
    // window.electron.ipcRenderer.send("open-video-window", imageName);
    console.log(imageName, "imagename");
  };
  window.electron.ipcRenderer.on("load-image", (event, data) => {
    const imageContainer = document.getElementById("imageContainer");
    if (data.error) {
      return;
    } else {
      imageContainer.innerHTML = "";

      data.images.forEach(({ buffer, image }) => {
        const imgElemet = document.createElement("img");
        const blob = new Blob([buffer], { type: "image" });
        const imgUrl = URL.createObjectURL(blob);

        imgElemet.src = imgUrl;
        imgElemet.alt = image;
        imgElemet.style.height = "200px";
        imgElemet.style.width = "auto";
        imgElemet.style.objectFit = "cover";
        imgElemet.style.margin = "10px";
        imageContainer.appendChild(imgElemet);
        setImages((prev) => [...prev, imgUrl]);
        // console.log(imgElemet.src);
      });
    }
  });



  // console.log(images);
  return (
    <div className="App">
      {/* <Carousel items={items}/> */}
      <h1>Select images</h1>
      {/* <img src={displayImage} /> */}
      <input
        type="file"
        id="folderInput"
        // directory=""
        // webkitdirectory=""
        onChange={handleFolderChange}
      />

      <div>
        <div
          style={{ border: "1px solid gray", height: "auto" }}
          id="imageContainer"
        >
          {/* {images.map((img, index) => {
            return (
              <img
                style={{ margin: "10px", border: "1px solid black" }}
                key={index}
                src={`file:/${img}`}
                alt={`Loading...${index + 1}`}
              />
            );  
          })}  */}
        </div>
      </div>
    </div>
  );
}

export default App;
