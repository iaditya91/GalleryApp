import React, { useEffect, useState } from "react";
import axiosInstance from "./config/axios";
import Box from "@mui/material/Box";
import ImageListItem, {
  imageListItemClasses,
} from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const s3_bucket_url = "https://assignmentimages.s3.amazonaws.com/";

const theme = createTheme({
  breakpoints: {
    values: {
      mobile: 0,
      bigMobile: 350,
      tablet: 650,
      desktop: 900,
    },
  },
});

function Gallery() {
  const [images, setImages] = useState([]);
  const [show, setShow] = useState(false);
  const getImages = async () => {
    return await axiosInstance.get(`/getImages`);
  };

  useEffect(() => {
    getImages()
      .then((res) => {
        setImages(res.data.msg);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: "250!important",
          backgroundColor: "#C62F41",
          display: "grid",
          border: "5px solid #C62F41",
          gridTemplateColumns: {
            mobile: "repeat(1, 1fr)",
            bigMobile: "repeat(2, 1fr)",
            tablet: "repeat(3, 1fr)",
            desktop: "repeat(4, 1fr)",
          },
          [`& .${imageListItemClasses.root}`]: {
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {images.map((item) => (
          <ImageListItem
            key={item.Key}
            className="square"
            sx={{
              margin: "6px 6px 6px 6px",
            }}
          >
            <img
              src={`${s3_bucket_url + item.Key}?w=248&fit=crop&auto=format`}
              alt=""
              onMouseOver={() => setShow((item.show = true))}
              onMouseOut={() => setShow((item.show = false))}
            />
            <ImageListItemBar
              title={item.metadata}
              subtitle={item.metadata}
              sx={{
                display: item.show ? "block" : "none",
                transition: "height 0.5s ease-out",
                height: "10%",
                width: "100%",
                bottom: "0",
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.9951330874146533) 100%)",
              }}
              actionIcon={
                <IconButton
                  sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                  aria-label={`info about ${item.metadata}`}
                ></IconButton>
              }
            ></ImageListItemBar>
          </ImageListItem>
        ))}
      </Box>
    </ThemeProvider>
  );
}

export default Gallery;
