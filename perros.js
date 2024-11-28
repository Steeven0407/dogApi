const api = axios.create({
    baseURL: 'https://api.thedogapi.com/v1/',   
});
api.defaults.headers.common['X-API-KEY'] = 'live_gNxya64DQIkhHCbhRdgnsUCXFozMh7vBWb693HCsS6ccEnD7C5tmxd4o5zkFCWSu'


const key = "live_gNxya64DQIkhHCbhRdgnsUCXFozMh7vBWb693HCsS6ccEnD7C5tmxd4o5zkFCWSu"
const url = `https://api.thedogapi.com/v1/images/search?limit=6&api_key=${key}`
const urlFavoritos= `https://api.thedogapi.com/v1/favourites?`
const urlSubirImagen = `https://api.thedogapi.com/v1/images/upload`  

const btn = document.getElementById("cambiarImagen")

const spanError = document.getElementById("error")

const btnfavoritos = document.querySelectorAll(".botonFavoritos")
console.log(btnfavoritos)
const cargarPerrosAleatorios = async () => {
    try {
        const response = await fetch(url)
        const data = await response.json()

        let img1 = document.getElementById("img1")
        let img2 = document.getElementById("img2")
        let img3 = document.getElementById("img3")
        let img4 = document.getElementById("img4")
        let img5 = document.getElementById("img5")
        
        for (let index = 0; index < 5; index++) {
            btnfavoritos[index].onclick = ()=>subirPerrosFavoritos(data[index].id)
        }

        img1.src = data[0].url
        img2.src = data[1].url
        img3.src = data[2].url
        img4.src = data[3].url
        img5.src = data[4].url

    } catch (error) {
        console.error("Error fetching data:", error);
        spanError.innerHTML ="Hubo un Error en la carga de los perros aleatorios " 
    }
}

const cargarPerrosFavoritos = async () => {
    const contenedorFavoritos = document.getElementById("favoritos")
    try {
        const response = await fetch(urlFavoritos,{
            method: "GET",
            headers: {
                'X-API-KEY': `${key}`
            }
        })
        const data = await response.json()
        //console.log(data);
        
        if(response.status!==200){
            spanError.innerHTML ="Hubo un Error en la solicitud de los favoritos " + response.status
        }else{
            contenedorFavoritos.innerHTML ="";
            data.forEach(perro => {
               
                const article = document.createElement("article")
                const img = document.createElement("img")
                const btnUnfavorite = document.createElement("img")
                
                btnUnfavorite.src = "https://img.icons8.com/ios/50/stitched-heart.png"
                btnUnfavorite.width= "50"
                btnUnfavorite.height= "50"

                article.classList.add("contenedor")
                img.classList.add("perroAleatorio")
                contenedorFavoritos.classList.add("perrosAleatorios")
                contenedorFavoritos.classList.add("imagenesFavoritas")
                btnUnfavorite.classList.add("botonUnfavorite")
                
                img.src = perro.image.url
                //aqui puedo tomar el id para agregarselo a la funcion
                btnUnfavorite.onclick = () =>eliminarFavorito(perro.id)
                article.appendChild(img);
                article.appendChild(btnUnfavorite);

                contenedorFavoritos.appendChild(article)


            });
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const subirPerrosFavoritos = async (id) => {
    const {data, status} = await api.post('favourites?',{
        image_id: id
    })
        if(status!==200){
            console.log(        status + data.message)
        }else{
            console.log("Se guardo en favoritos");
            cargarPerrosFavoritos()
        }
        
}

const eliminarFavorito = async (id)=>{
    let urlEliminar = `https://api.thedogapi.com/v1/favourites/${id}?&api_key=${key}`

    const response = await fetch(urlEliminar, {
        method: 'DELETE',
        headers: {
            'X-API-KEY': `${key}`
        }
    })
    const data = await response.json();

    if(response.status!==200){
        console.log(response.status + data.message)
    }else{
        console.log("Se elimino de favoritos");

        cargarPerrosFavoritos()
    }

}

const subirImagenPerro = async()=>{
    const formulario = document.getElementById("formulario")
    const formData = new FormData(formulario)

    //console.log(formData.get('file'))


    const response = await fetch(urlSubirImagen, { 
        method: 'POST',
        headers: {
            'X-API-KEY': `${key}`
        },
        body: formData,
    })
    const data = await response.json();
    
    if(data.status!==200){
        console.log(response.status + data.message)
        //console.log({data})
    }else{
        console.log("Se agrego la imagen");
    }

    subirPerrosFavoritos(data.id)   
    document.getElementById('preview').src = ""
}

document.getElementById('file').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
});

cargarPerrosAleatorios()
cargarPerrosFavoritos()

btn.addEventListener("click", cargarPerrosAleatorios)  