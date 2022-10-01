import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';

import Img1 from './images-take-home/bad_images/bad_image_1.jpeg';
import Img2 from './images-take-home/bad_images/bad_image_2.jpeg';
import Img3 from './images-take-home/bad_images/bad_image_3.jpeg';
import Img4 from './images-take-home/bad_images/bad_image_4.jpeg';
import Img5 from './images-take-home/good_images/good_image_1.jpeg';
import Img6 from './images-take-home/good_images/good_image_2.jpeg';
import Img7 from './images-take-home/good_images/good_image_3.jpeg';

import 'chart.js/auto';
import './App.css';

const IMGS = [Img1, Img2, Img3, Img4, Img5, Img6, Img7];
const VIEW = {
  List: 'list',
  Group: 'group'
}

const componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

const rgbToHex = (r, g, b) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

const App = () => {
  const [imageInfo, setImageInfo] = useState([]);
  const [viewType, setViewType] = useState(VIEW.List)
  console.log('image list data: ', imageInfo);
  const chartRef = useRef();
  const goodImgs = imageInfo.filter((item) => item.good);
  const badImgs = imageInfo.filter((item) => !item.good);

  const loadImgs = (index) => {
    const image = new Image();
    image.onload = () => {
      const ratio = image.width / image.height;
      const canvas = document.getElementById(`canvas-apple-${index + 1}`);
      canvas.width = 250;
      canvas.height = 250 / ratio;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, 250, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const colors = [];
      let redCount = 0;
      let greenCount = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const colorCode = rgbToHex(r, g, b);
        if (r > g && r > b) redCount ++;
        else if (g > r && g> b) greenCount ++;
        colors.push(colorCode);
      }
      const totalPoints = colors.filter((color) => color !== '#ffffff').length;
      const redPercent = redCount / totalPoints * 100;
      const greenPercent = greenCount / totalPoints * 100;

      const data = {
        id: index,
        colors,
        redPercent,
        greenPercent,
        good: redPercent > 60 && greenPercent > 5,
        orgWidth: image.width,
        orgHeight: image.height,
        src: IMGS[index],
      };
      setImageInfo((prev) => {
        if (!prev.map((item) => item.id).includes(data.id)) return [...prev, data];
        else return prev;
      });
    }
    image.src = IMGS[index];
  }

  const chartData = {
    labels: ['Total', 'Good', 'Bad'],
    datasets: [{
      data: [imageInfo.length, goodImgs.length, badImgs.length],
      backgroundColor: ['blue', 'green', 'red']
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: false,
    },
    scales: {
      x: { display: true },
      y: { display: true }
    }
  }

  useEffect(() => {
    IMGS.map((img, index) => loadImgs(index));
  }, [])

  return (
    <Container sx={{ py: 5 }}>
      <Box display="flex" justifyContent="center" mb={4}>
        <Typography variant="h3" color="primary" textAlign="center">
          Yembo.ai Take-Home Assignment
        </Typography>
      </Box>

      <Box display="none">
        {IMGS.map((img, index) => (
          <canvas key={index} id={`canvas-apple-${index + 1}`} />
        ))}
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" color="primary">
              Image Assets
            </Typography>

            <ToggleButtonGroup
              exclusive
              color="primary"
              onChange={(e, value) => value && setViewType(value)}
              value={viewType}
            >
              <ToggleButton size="small" value={VIEW.List}>List</ToggleButton>
              <ToggleButton size="small" value={VIEW.Group}>Group</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {viewType === VIEW.Group && (
            <>
              <Box mb={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Good Images
                </Typography>

                <Box
                  borderColor="grey.200"
                  sx={{ borderStyle: 'solid', borderWidth: 2 }}
                >
                  <Grid container spacing={2}>
                    {goodImgs.map((imgItem, index) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          p={2}
                          width="100%"
                          height="100%"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          boxSizing="border-box"
                        >
                          <img
                            src={imgItem.src}
                            width="100%"
                            height="100%"
                            style={{ objectFit: 'contain' }}
                            alt="Good"
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>

              <Box mb={4}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Bad Images
                </Typography>

                <Box
                  borderColor="grey.200"
                  sx={{ borderStyle: 'solid', borderWidth: 2 }}
                >
                  <Grid container spacing={2}>
                    {badImgs.map((imgItem, index) => (
                      <Grid item xs={6} key={index}>
                        <Box
                          p={2}
                          width="100%"
                          height="100%"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          boxSizing="border-box"
                        >
                          <img
                            src={imgItem.src}
                            width="100%"
                            height="100%"
                            style={{ objectFit: 'contain' }}
                            alt="Bad"
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </>
          )}

          {viewType === VIEW.List && (
            <Box
              borderColor="grey.200"
              sx={{ borderStyle: 'solid', borderWidth: 2 }}
            >
              <Grid container spacing={2}>
                {imageInfo.map((imgItem, index) => (
                  <Grid item xs={6} key={index}>
                    <Box
                      p={2}
                      width="100%"
                      height="100%"
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      boxSizing="border-box"
                    >
                      <img
                        src={imgItem.src}
                        width="100%"
                        height="100%"
                        style={{ objectFit: 'contain' }}
                        alt="Good"
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <Box mb={2}>
            <Typography variant="h5" color="primary">
              Image List
            </Typography>
          </Box>

          <Paper elevation={4} sx={{ mb: 4 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="left"
                    padding="normal"
                    sortDirection={false}
                  >
                    <Typography>Index</Typography>
                  </TableCell>

                  <TableCell
                    align="left"
                    padding="normal"
                    sortDirection={false}
                  >
                    <Typography>Width</Typography>
                  </TableCell>

                  <TableCell
                    align="left"
                    padding="normal"
                    sortDirection={false}
                  >
                    <Typography>Height</Typography>
                  </TableCell>

                  <TableCell
                    align="left"
                    padding="normal"
                    sortDirection={false}
                  >
                    <Typography>Quality</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {imageInfo.sort((a, b) => a.id - b.id).map((info, index) => (
                  <TableRow key={`${info.id}-${index}`}>
                    <TableCell component="th" scope="row">
                      {info.id + 1}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {info.orgWidth}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {info.orgHeight}
                    </TableCell>

                    <TableCell component="th" scope="row">
                      {info.good ? 'Good' : 'Bad'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Box mb={2}>
            <Typography variant="h5" color="primary">
              Break Down
            </Typography>
          </Box>

          <Paper elevation={4} sx={{ mb: 4 }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Total Images
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {imageInfo.length}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Good Images
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {goodImgs.length}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell component="th" scope="row">
                    Bad Images
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {badImgs.length}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>

          <Box mb={2}>
            <Typography variant="h5" color="primary">
              Graph
            </Typography>
          </Box>

          <Paper sx={{ p: 4 }} elevation={4}>
            <Bar ref={chartRef} data={chartData} options={chartOptions} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
