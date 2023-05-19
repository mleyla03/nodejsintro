import { useEffect, useState } from "react"

function App() {
  const[products,setProducts] = useState([]);
  const[newProduct,setNewProduct] = useState({});

  useEffect(()=>{
    fetch('http://localhost:8080/api/cars')
    .then(res=>res.json())
    .then(data=>{
      setProducts(data);
      setNewProduct({modelName:'',brandName:''})
    })
  },[])
  function handleSubmit(e){
    e.preventDefault();
    fetch('http://localhost:8080/api/cars',{
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body:JSON.stringify(newProduct)
    })
    setProducts([...products,newProduct]);
  }
  function handleChange(e){
    setNewProduct({...newProduct, [e.target.name]: e.target.value});
  }

  function handleSearch(e){
    fetch(`http://localhost:8080/api/cars?brandName=${e.target.value}`)
    .then(res=>res.json())
    .then(data=>setProducts(data))
  }
  
  return (
    <>
        <h1 style={{color:"purple",textAlign:"center"}}>Cars</h1>
        <input style={{width:"30%", margin:"0 auto",display:"block"}} onChange={(e)=>handleSearch(e)} placeholder="search product"/>
        <ul style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
          {products && products.map((product)=>{
            return <li style={{listStyle:"none"}} key={product.id}>
              {product.brandName} | {product.modelName}
              <button onClick={()=>{
                if (window.confirm('are you sure to delete?')) {
                    fetch(`http://localhost:8080/api/cars/${product.id}`,{
                      method:'DELETE'
                    })
                    setProducts(products.filter((pro)=>pro.id!==product.id))
                }
              }}>delete</button>
              </li>
          })}
        </ul>
        <form style={{display:"flex",alignItems:"center",justifyContent:"center"}} onSubmit={(e)=>handleSubmit(e)}>
           <input onChange={(e)=>handleChange(e)} name="brandName" placeholder="product name" type="text"/>
           <input onChange={(e)=>handleChange(e)} name="modelName" placeholder="cars modelName" type="text"/>
           <button>add product</button>
        </form>
    </>
  )
}

export default App
