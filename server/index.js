const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors());
const PORT = 8080;
const bodyParser = require("body-parser");
const crypto = require("crypto");
app.use(bodyParser.json());

const fakeData = [
    {
        "id": 1,
        "brandName": "BMW",
        "modelName": "X5",
        "year": 2023,
        "color": "black",
        "isNew":true
    },
    {
        "id": 2,
        "brandName": "Audi",
        "modelName": "A3",
        "year": 2022,
        "color": "white",
        "isNew":false
    },
    {
        "id": 3,
        "brandName": "Audi",
        "modelName": "A2",
        "year": 2022,
        "color": "red",
        "isNew":false
    }
];


app.get("/api", (req, res) => {
  res.send("Welcome to Our API!");
});


app.get("/api/cars", (req, res) => {
  const { brandName } = req.query;
  
  if (!brandName ) {
    res.status(200).send(fakeData);
  } else {
    const filteredData = fakeData.filter((x) =>
      x.brandName.toLowerCase().trim().includes(brandName.toLowerCase().trim())
    );
    res.status(200).send(filteredData);
  }
});

app.get("/api/cars/:id", (req, res) => {
  const id = req.params.id;
  const product = fakeData.find((x) => x.id == id);
  if (product === undefined) {
    res.status(204).send({
      message: "product not found!",
    });
  } else {
    res.status(200).send(product);
  }
});

app.post("/api/", (req, res) => {
  const {brandName,modelName,year,color,isNew } = req.body;
  const newProduct = {
    id: crypto.randomUUID(),
    brandName:brandName,
    modelName:modelName,
    year:year,
    color:color,
    isNew:isNew
  };
  fakeData.push(newProduct);
  res.status(201).send({
    message: "product created successfully!",
    data: newProduct,
  });
});

app.delete("/api/cars/:id", (req, res) => {
  const id = req.params.id;
  const deletingProduct = fakeData.find((x) => x.id == id);
  let idx = fakeData.indexOf(deletingProduct);
  fakeData.splice(idx, 1);
  if (deletingProduct === undefined) {
    res.status(204).send("product not found!");
  } else {
    res.status(203).send({
      message: "product deleted successfully!",
    });
  }
});
//Edit Product
app.put("/api/cars/:id", (req, res) => {
  const id = req.params.id;
  const { brandName,modelName,year,color,isNew } = req.body;

  let editingProduct = fakeData.find((x) => x.id == id);
  if (brandName) {
    editingProduct.brandName = brandName;
  }
  if (modelName) {
    editingProduct.modelName = modelName;
  }
  if(year){
     editingProduct.year=year
  }
  if(color){
    editingProduct.color= color
  }
  if(isNew){
    editingProduct.isNew=isNew
  }
  res.status(200).send({
    message: "product updated successfully!",
  });
});

app.listen(PORT, () => {
  console.log(`App running on  PORT: ${PORT}`);
});