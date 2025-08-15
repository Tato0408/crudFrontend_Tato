const API_URL = "http://localhost:8080/apiCategory"

async function getCategories(){
    const res = await fetch(`${API_URL}/getDataCategories`);
    return res.json();
}

async function createCategory(data){
    await fecth(`${API_URL}/newCategory`,{
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

async function updateCategory(id, data){
    await fecth(`${API_URL}/updateCategory/${id}`,{
        method: "PUT",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

async function deleteCategory(id){
    await fetch(`${API_URL}/deleteCategory/${id}`,{
        method:"DELETE"
    });
}