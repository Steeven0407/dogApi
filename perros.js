const key = "live_gNxya64DQIkhHCbhRdgnsUCXFozMh7vBWb693HCsS6ccEnD7C5tmxd4o5zkFCWSu"
const url = `https://api.thedogapi.com/v1/images/search?limit=3&api_key=${key}`
const btn = document.getElementById("cambiarImagen")

const perros = async () => {
    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log(data);

        let img1 = document.getElementById("img1")
        let img2 = document.getElementById("img2")
        let img3 = document.getElementById("img3")
        img1.src = data[0].url
        img2.src = data[1].url
        img3.src = data[2].url
    } catch (error) {
        console.error("Error fetching data:", error);
    }


}

perros()

btn.addEventListener("click", perros)