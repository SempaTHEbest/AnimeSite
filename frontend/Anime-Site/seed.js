// --- НАЛАШТУВАННЯ ---
const API_URL = "http://localhost:5049/api/anime"; // Перевір свій порт!
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImY1ZjMyMmNkLTk4ZjEtNDQ5OC1hMTgzLWRlZmFiZmNmODM4YSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJzdHJpbmcxIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoic3RyaW5nMUBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsImV4cCI6MTc2NDAzMjQyNH0.g6GUzLXZYIJOrxJQpuzsKO0NANlHp13gWpcuJ2ETnXA"; // <--- ОБОВ'ЯЗКОВО!

// --- ДАНІ (21 Аніме) ---
const animeList = [
  {
    title: "Kimetsu no Yaiba",
    description: "A family is attacked by demons and only two members survive - Tanjiro and his sister Nezuko, who is turning into a demon slowly. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZjZjNzI5MDctY2Y4YS00NmM4LTljMmItZTFkOTExNGI3ODRhXkEyXkFqcGdeQXVyNjc3MjQzNTI@._V1_.jpg",
    rating: 8.7,
    studio: "ufotable",
    status: "Ongoing",
    type: "TV",
    releaseDate: "2019-04-06T00:00:00.000Z",
    totalEpisodes: 26
  },
  {
    title: "Jujutsu Kaisen",
    description: "A boy swallows a cursed talisman - the finger of a demon - and becomes cursed himself. He enters a shaman's school to be able to locate the demon's other body parts and thus exorcise himself.",
    imageUrl: "https://static.yani.tv/posters/full/1636691934.jpg",
    rating: 8.5,
    studio: "MAPPA",
    status: "Ongoing",
    type: "TV",
    releaseDate: "2020-10-03T00:00:00.000Z",
    totalEpisodes: 24
  },
  {
    title: "One Piece",
    description: "Follows the adventures of Monkey D. Luffy and his pirate crew in order to find the greatest treasure ever left by the legendary Pirate, Gold Roger. The famous mystery treasure named 'One Piece'.",
    imageUrl: "https://static.hdrezka.ac/i/2025/4/8/re00d72b6e42fnm76a75r.jpg",
    rating: 8.9,
    studio: "Toei Animation",
    status: "Ongoing",
    type: "TV",
    releaseDate: "1999-10-20T00:00:00.000Z",
    totalEpisodes: 1080
  },
  {
    title: "Naruto: Shippuden",
    description: "Naruto Uzumaki, is a loud, hyperactive, adolescent ninja who constantly searches for approval and recognition, as well as to become Hokage, who is acknowledged as the leader and strongest of all ninja in the village.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmQ2LTljNDYtMmZjNTc5MDUxMzViXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    rating: 8.7,
    studio: "Pierrot",
    status: "Completed",
    type: "TV",
    releaseDate: "2007-02-15T00:00:00.000Z",
    totalEpisodes: 500
  },
  {
    title: "Bleach: TYBW",
    description: "High school student Ichigo Kurosaki, who has the ability to see ghosts, gains soul reaper powers from Rukia Kuchiki and sets out to save the world from 'Hollows'.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/a/a2/Bleach_Thousand-Year_Blood_War.png",
    rating: 9.1,
    studio: "Pierrot",
    status: "Ongoing",
    type: "TV",
    releaseDate: "2022-10-11T00:00:00.000Z",
    totalEpisodes: 26
  },
  {
    title: "Chainsaw Man",
    description: "Following a betrayal, a young man left for the dead is reborn as a powerful devil-human hybrid after merging with his pet devil and is soon enlisted into an organization dedicated to hunting devils.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Chainsawman.jpg/250px-Chainsawman.jpg",
    rating: 8.5,
    studio: "MAPPA",
    status: "Completed",
    type: "TV",
    releaseDate: "2022-10-12T00:00:00.000Z",
    totalEpisodes: 12
  },
  {
    title: "Death Note",
    description: "An intelligent high school student goes on a secret crusade to eliminate criminals from the world after discovering a notebook capable of killing anyone whose name is written into it.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYTgyZDhmMTEtZDFhNi00MTc4LTg3NjUtYWJlNGE5Mzk2NzMxXkEyXkFqcGc@._V1_.jpg",
    rating: 9.0,
    studio: "Madhouse",
    status: "Completed",
    type: "TV",
    releaseDate: "2006-10-04T00:00:00.000Z",
    totalEpisodes: 37
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    description: "Two brothers search for a Philosopher's Stone after an attempt to revive their deceased mother goes awry and leaves them in damaged physical forms.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZmEzN2YzOTItMDI5MS00MGU4LWI1NWQtOTg5ZThhNGQwYTEzXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
    rating: 9.1,
    studio: "Bones",
    status: "Completed",
    type: "TV",
    releaseDate: "2009-04-05T00:00:00.000Z",
    totalEpisodes: 64
  },
  {
    title: "Cyberpunk: Edgerunners",
    description: "A street kid trying to survive in a technology and body modification-obsessed city of the future. Having everything to lose, he chooses to stay alive by becoming an edgerunner.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BM2JkMzM2ZmYtNWU4MS00MjZhLWFhZWUtYWFjYTJkN2RhZDliXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    rating: 8.3,
    studio: "Trigger",
    status: "Completed",
    type: "ONA",
    releaseDate: "2022-09-13T00:00:00.000Z",
    totalEpisodes: 10
  },
  {
    title: "Vinland Saga",
    description: "Thorfinn pursues a journey with his father's killer in order to take revenge and end his life in a duel as an honorable warrior and pay his father a homage.",
    imageUrl: "https://img.yani.tv/posters/full/1636691037.jpg",
    rating: 8.8,
    studio: "Wit Studio",
    status: "Ongoing",
    type: "TV",
    releaseDate: "2019-07-07T00:00:00.000Z",
    totalEpisodes: 48
  },
  {
    title: "Spy x Family",
    description: "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own, and all three must strive to keep together.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BZDkwNjc0NWEtNzJlOC00N2YwLTk4MjktZGFlZDE2Y2QzOWI0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    rating: 8.4,
    studio: "Wit Studio / CloverWorks",
    status: "Ongoing",
    type: "TV",
    releaseDate: "2022-04-09T00:00:00.000Z",
    totalEpisodes: 25
  },
  {
    title: "Tokyo Ghoul",
    description: "A Tokyo college student is attacked by a ghoul, a superpowered human who feeds on human flesh. He survives, but has become part ghoul and becomes a fugitive on the run.",
    imageUrl: "https://static.yani.tv/posters/full/1519225029.jpg",
    rating: 7.8,
    studio: "Pierrot",
    status: "Completed",
    type: "TV",
    releaseDate: "2014-07-04T00:00:00.000Z",
    totalEpisodes: 12
  },
  {
    title: "Hunter x Hunter",
    description: "Gon Freecss aspires to become a Hunter, an exceptional being capable of greatness. With his friends and his potential, he seeks for his father who left him when he was younger.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDBiMzMyMWItNDFkYy00MjBmLTk2ZDAtYmE2N2U4YzFlZDRmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    rating: 9.0,
    studio: "Madhouse",
    status: "Completed",
    type: "TV",
    releaseDate: "2011-10-02T00:00:00.000Z",
    totalEpisodes: 148
  },
  {
    title: "Blue Lock",
    description: "The Japanese national team finishes 16th in the FIFA World Cup. As a result, the Japanese Football Union hires the soccer enigma Ego Jinpachi. His master plan to lead Japan to stardom is Blue Lock.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNWFlNmJkN2YtNGRiZS00NjExLTlmNmEtYzdiMTdiZmMzYzAwXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
    rating: 8.3,
    studio: "8bit",
    status: "Ongoing",
    type: "TV",
    releaseDate: "2022-10-09T00:00:00.000Z",
    totalEpisodes: 24
  },
  {
    title: "Mushoku Tensei",
    description: "A 34-year-old underachiever gets run over by a bus, but his story doesn't end there. Reincarnated in a new world as an infant, Rudy will seize every opportunity to live the life he's always wanted.",
    imageUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202404/0408/882465e73007b068bde427735d70b4f176a62e1e0e4f71b8.png",
    rating: 8.4,
    studio: "Studio Bind",
    status: "Ongoing",
    type: "TV",
    releaseDate: "2021-01-11T00:00:00.000Z",
    totalEpisodes: 23
  },
  {
    title: "Violet Evergarden",
    description: "In the aftermath of a great war, Violet Evergarden, a young female ex-soldier, gets a job at a writers' agency and goes on assignments to create letters that can connect people.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMWUwNDFiNjQtYjQ0MC00MTcxLWE0MGQtNTdkYTlhZGU2NDFmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    rating: 8.4,
    studio: "Kyoto Animation",
    status: "Completed",
    type: "TV",
    releaseDate: "2018-01-11T00:00:00.000Z",
    totalEpisodes: 13
  },
  {
    title: "Sword Art Online",
    description: "In the year 2022, thousands of people get trapped in a new virtual MMORPG and the lone wolf player, Kirito, works to escape.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYjY4MDU2YjMtNzY1MC00ODg1LWIwMzYtMWE5YTA3YTI4ZjMxXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg",
    rating: 7.5,
    studio: "A-1 Pictures",
    status: "Completed",
    type: "TV",
    releaseDate: "2012-07-08T00:00:00.000Z",
    totalEpisodes: 25
  },
  {
    title: "Re:Zero",
    description: "Subaru Natsuki is summoned to another world. He befriends a silver-haired half-elf girl. He discovers he has the ability to 'Return by Death', enabling him to reverse time by dying.",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOTIyNGIzY2EtYjMyZS00Y2M0LWE4MTktNmQ3Y2IwZTBhNWE2XkEyXkFqcGc@._V1_.jpg",
    rating: 8.1,
    studio: "White Fox",
    status: "Ongoing",
    type: "TV",
    releaseDate: "2016-04-04T00:00:00.000Z",
    totalEpisodes: 50
  },
  {
    title: "Your Name",
    description: "Two strangers find themselves linked in a bizarre way. When a connection forms, will distance be the only thing to keep them apart?",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BOTkzMGIyYzAtMDQyYi00OTkxLWI2ZGMtODNmYjMyMWM3ZGY1XkEyXkFqcGc@._V1_.jpg",
    rating: 8.4,
    studio: "CoMix Wave Films",
    status: "Completed",
    type: "Movie",
    releaseDate: "2016-08-26T00:00:00.000Z",
    totalEpisodes: 1
  }
];

// --- ФУНКЦІЯ ЗАПУСКУ ---
async function seedDatabase() {
  console.log(`🚀 Starting seed process for ${animeList.length} animes...`);
  
  if (ADMIN_TOKEN === "ВСТАВ_ТУТ_СВІЙ_ДОВГИЙ_JWT_ТОКЕН") {
      console.error("❌ ERROR: Ви забули вставити Admin Token в скрипт!");
      return;
  }

  let successCount = 0;
  let failCount = 0;

  for (const anime of animeList) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${ADMIN_TOKEN}`
        },
        body: JSON.stringify(anime)
      });

      if (response.ok) {
        console.log(`✅ Added: ${anime.title}`);
        successCount++;
      } else {
        const errorText = await response.text();
        console.error(`❌ Failed: ${anime.title} - ${response.status} ${errorText}`);
        failCount++;
      }
    } catch (error) {
      console.error(`❌ Error adding ${anime.title}:`, error.message);
      failCount++;
    }
  }

  console.log("\n------------------------------------------------");
  console.log(`🎉 Seed finished!`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log("------------------------------------------------");
}

// Запуск
seedDatabase();