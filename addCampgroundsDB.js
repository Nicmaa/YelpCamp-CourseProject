require('dotenv').config();
const mongoose = require('mongoose');
const pexels = require('pexels');
const apiKey = process.env.PEXELS_API_KEY;
const client = pexels.createClient(apiKey);

mongoose.connect('mongodb://127.0.0.1:27017/Campgrounds');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error: "));
db.once("open", () => {
    console.log("Database connected!");
})

const Camp = require('./models/campground');

const campings = [
    { title: "Lago Verde Camping", location: "Lombardia, Italia", description: "Un'oasi di pace sulle rive di un lago cristallino.", price: 35, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Montagna Blu Retreat", location: "Berna, Svizzera", description: "Perfetto per gli amanti della montagna e delle escursioni.", price: 50, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Foresta Magica", location: "Baviera, Germania", description: "Un campeggio immerso nel verde della Foresta Nera.", price: 40, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Costa Dorata", location: "Catalogna, Spagna", description: "Rilassati sulla costa con spiagge dorate e acque turchesi.", price: 45, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Sole e Mare", location: "Provenza, Francia", description: "Un campeggio sulla Riviera Francese con vista mozzafiato.", price: 55, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Ruscello Tranquillo", location: "Tirolo, Austria", description: "Perfetto per chi cerca tranquillità vicino a un ruscello.", price: 38, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Avventura Nordica", location: "Bergen, Norvegia", description: "Un'esperienza unica tra fiordi e natura incontaminata.", price: 60, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Baia Azzurra", location: "Santorini, Grecia", description: "Campeggio sul mare con acque cristalline e tramonti spettacolari.", price: 42, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Canyon Selvaggio", location: "Arizona, USA", description: "Un campeggio nel cuore del Grand Canyon.", price: 65, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Praterie Dorate", location: "Alberta, Canada", description: "Un'esperienza autentica nelle grandi praterie canadesi.", price: 48, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Rifugio degli Elfi", location: "Lapponia, Finlandia", description: "Un'esperienza magica nella terra del sole di mezzanotte.", price: 58, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Laguna Verde", location: "Algarve, Portogallo", description: "Campeggio con vista su una splendida laguna turchese.", price: 36, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Dune Dorate", location: "Merzouga, Marocco", description: "Un campeggio nel deserto per un'esperienza unica.", price: 52, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Isola dei Coralli", location: "Queensland, Australia", description: "Perfetto per snorkeling e immersioni nella barriera corallina.", price: 75, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Oasi Segreta", location: "Siwa, Egitto", description: "Un campeggio nel cuore di un'oasi nel deserto.", price: 45, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Luna Park Camping", location: "Amsterdam, Olanda", description: "Divertimento e relax vicino ai canali olandesi.", price: 37, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Baia dei Pirati", location: "Aruba, Caraibi", description: "Un campeggio tropicale su un'isola paradisiaca.", price: 70, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Neve e Stelle", location: "Lapponia, Svezia", description: "Un campeggio perfetto per vedere l'aurora boreale.", price: 55, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Cime Innevate", location: "Patagonia, Argentina", description: "Campeggio tra le vette delle Ande.", price: 50, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Grotte Nascoste", location: "Ha Long, Vietnam", description: "Un campeggio avventuroso tra grotte e foreste tropicali.", price: 42, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Terme Naturali", location: "Reykjavik, Islanda", description: "Campeggio vicino a sorgenti termali naturali.", price: 65, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Bosco Fatato", location: "Bieszczady, Polonia", description: "Un campeggio immerso nei boschi con atmosfera fiabesca.", price: 39, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Baia Blu", location: "Dalmazia, Croazia", description: "Campeggio con accesso diretto al mare cristallino.", price: 48, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Savane Dorate", location: "Masai Mara, Kenya", description: "Un campeggio nella savana per avvistare la fauna selvatica.", price: 55, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Fiume della Pace", location: "Amazzonia, Brasile", description: "Un campeggio sulle rive di un fiume tropicale.", price: 41, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Lago del Silenzio", location: "Highlands, Scozia", description: "Un campeggio in un'area remota e silenziosa.", price: 47, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Baia delle Balene", location: "Hermanus, Sudafrica", description: "Un campeggio perfetto per avvistare le balene.", price: 60, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Costa dei Vulcani", location: "Big Island, Hawaii", description: "Campeggio con vista su vulcani attivi.", price: 78, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Oceano Stellato", location: "Aoraki, Nuova Zelanda", description: "Un campeggio con cielo limpido per osservare le stelle.", price: 53, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Isola Selvaggia", location: "Palawan, Filippine", description: "Un campeggio su un'isola incontaminata.", price: 49, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Canyon dei Giganti", location: "Chihuahua, Messico", description: "Campeggio avventuroso tra canyon e foreste.", price: 52, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Rifugio delle Aquile", location: "Durmitor, Montenegro", description: "Un campeggio con vista sulle montagne.", price: 39, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Sorgenti Cristalline", location: "Bled, Slovenia", description: "Un campeggio con accesso a sorgenti d'acqua purissima.", price: 46, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Bosco del Silenzio", location: "Transilvania, Romania", description: "Un campeggio per chi ama la tranquillità della natura.", price: 37, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Paradiso Perduto", location: "Phuket, Thailandia", description: "Un campeggio tropicale su una spiaggia nascosta.", price: 58, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Picco dell'Alba", location: "Everest, Nepal", description: "Un campeggio con vista sull'Himalaya.", price: 67, author: '67bca31a1865ecfb0b0c5789' },
    { title: "Tundra Infinita", location: "Siberia, Russia", description: "Un'esperienza estrema nelle distese artiche.", price: 61, author: '67bca31a1865ecfb0b0c5789' }
];

const getImage = async (title) => {
    let query = title.split(' ')[0]; //Uso la prima parola del titolo per la ricerca su Pexels
    let photos = await client.photos.search({ query, per_page: 1 });
    if (photos.photos.length > 0) {
        return photos.photos[0].src.original; // Restituisci l'URL dell'immagine
    } else {
        query = 'Nature'; //Se non trova niente metto un'immagine di default
        photos = await client.photos.search({ query, per_page: 1 });
        return photos.photos[0].src.original;
    }
}

const addImagesToCampings = async () => {
    for (let i = 0; i < campings.length; i++) {
        const imageUrl = await getImage(campings[i].title);
        campings[i].image = imageUrl;
    }
}

const deleteAll = async () => {
    await Camp.deleteMany({});
}

const addCamping = async () => {
    await deleteAll();
    await addImagesToCampings();
    await Camp.insertMany(campings);
}

deleteAll().then(() => {
    console.log('Deleted all!');
})

addCamping().then(() => {
    console.log('Done!');
    mongoose.connection.close();
});
