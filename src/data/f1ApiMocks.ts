// Stubbed F1 API data - mirrors Jolpica API response format
// Later swap these stubs with actual API calls using the service layer

import {
  F1ApiResponse,
  DriverTableResponse,
  ConstructorTableResponse,
  RaceTableResponse,
  RaceResultsTableResponse,
  DriverStandingsTableResponse,
  ConstructorStandingsTableResponse,
  CircuitTableResponse,
  ApiDriver,
  ApiConstructor,
  ApiCircuit,
  ApiRace,
} from './f1ApiTypes';

// ============ STUBBED DRIVERS (2025 Season) ============
export const mockDriversApiResponse: F1ApiResponse<DriverTableResponse> = {
  MRData: {
    xmlns: "",
    series: "f1",
    url: "http://api.jolpi.ca/ergast/f1/2025/drivers/",
    limit: "30",
    offset: "0",
    total: "20",
    DriverTable: {
      season: "2025",
      Drivers: [
        {
          driverId: "max_verstappen",
          permanentNumber: "1",
          code: "VER",
          url: "http://en.wikipedia.org/wiki/Max_Verstappen",
          givenName: "Max",
          familyName: "Verstappen",
          dateOfBirth: "1997-09-30",
          nationality: "Dutch"
        },
        {
          driverId: "lawson",
          permanentNumber: "30",
          code: "LAW",
          url: "http://en.wikipedia.org/wiki/Liam_Lawson",
          givenName: "Liam",
          familyName: "Lawson",
          dateOfBirth: "2002-02-11",
          nationality: "New Zealand"
        },
        {
          driverId: "leclerc",
          permanentNumber: "16",
          code: "LEC",
          url: "http://en.wikipedia.org/wiki/Charles_Leclerc",
          givenName: "Charles",
          familyName: "Leclerc",
          dateOfBirth: "1997-10-16",
          nationality: "Monegasque"
        },
        {
          driverId: "hamilton",
          permanentNumber: "44",
          code: "HAM",
          url: "http://en.wikipedia.org/wiki/Lewis_Hamilton",
          givenName: "Lewis",
          familyName: "Hamilton",
          dateOfBirth: "1985-01-07",
          nationality: "British"
        },
        {
          driverId: "russell",
          permanentNumber: "63",
          code: "RUS",
          url: "http://en.wikipedia.org/wiki/George_Russell_(racing_driver)",
          givenName: "George",
          familyName: "Russell",
          dateOfBirth: "1998-02-15",
          nationality: "British"
        },
        {
          driverId: "antonelli",
          permanentNumber: "12",
          code: "ANT",
          url: "http://en.wikipedia.org/wiki/Andrea_Kimi_Antonelli",
          givenName: "Andrea Kimi",
          familyName: "Antonelli",
          dateOfBirth: "2006-08-25",
          nationality: "Italian"
        },
        {
          driverId: "norris",
          permanentNumber: "4",
          code: "NOR",
          url: "http://en.wikipedia.org/wiki/Lando_Norris",
          givenName: "Lando",
          familyName: "Norris",
          dateOfBirth: "1999-11-13",
          nationality: "British"
        },
        {
          driverId: "piastri",
          permanentNumber: "81",
          code: "PIA",
          url: "http://en.wikipedia.org/wiki/Oscar_Piastri",
          givenName: "Oscar",
          familyName: "Piastri",
          dateOfBirth: "2001-04-06",
          nationality: "Australian"
        },
        {
          driverId: "alonso",
          permanentNumber: "14",
          code: "ALO",
          url: "http://en.wikipedia.org/wiki/Fernando_Alonso",
          givenName: "Fernando",
          familyName: "Alonso",
          dateOfBirth: "1981-07-29",
          nationality: "Spanish"
        },
        {
          driverId: "stroll",
          permanentNumber: "18",
          code: "STR",
          url: "http://en.wikipedia.org/wiki/Lance_Stroll",
          givenName: "Lance",
          familyName: "Stroll",
          dateOfBirth: "1998-10-29",
          nationality: "Canadian"
        },
        {
          driverId: "gasly",
          permanentNumber: "10",
          code: "GAS",
          url: "http://en.wikipedia.org/wiki/Pierre_Gasly",
          givenName: "Pierre",
          familyName: "Gasly",
          dateOfBirth: "1996-02-07",
          nationality: "French"
        },
        {
          driverId: "doohan",
          permanentNumber: "7",
          code: "DOO",
          url: "http://en.wikipedia.org/wiki/Jack_Doohan",
          givenName: "Jack",
          familyName: "Doohan",
          dateOfBirth: "2003-01-20",
          nationality: "Australian"
        },
        {
          driverId: "tsunoda",
          permanentNumber: "22",
          code: "TSU",
          url: "http://en.wikipedia.org/wiki/Yuki_Tsunoda",
          givenName: "Yuki",
          familyName: "Tsunoda",
          dateOfBirth: "2000-05-11",
          nationality: "Japanese"
        },
        {
          driverId: "hadjar",
          permanentNumber: "6",
          code: "HAD",
          url: "http://en.wikipedia.org/wiki/Isack_Hadjar",
          givenName: "Isack",
          familyName: "Hadjar",
          dateOfBirth: "2004-09-28",
          nationality: "French"
        },
        {
          driverId: "hulkenberg",
          permanentNumber: "27",
          code: "HUL",
          url: "http://en.wikipedia.org/wiki/Nico_Hülkenberg",
          givenName: "Nico",
          familyName: "Hülkenberg",
          dateOfBirth: "1987-08-19",
          nationality: "German"
        },
        {
          driverId: "bearman",
          permanentNumber: "87",
          code: "BEA",
          url: "http://en.wikipedia.org/wiki/Oliver_Bearman",
          givenName: "Oliver",
          familyName: "Bearman",
          dateOfBirth: "2005-05-08",
          nationality: "British"
        },
        {
          driverId: "albon",
          permanentNumber: "23",
          code: "ALB",
          url: "http://en.wikipedia.org/wiki/Alexander_Albon",
          givenName: "Alexander",
          familyName: "Albon",
          dateOfBirth: "1996-03-23",
          nationality: "Thai"
        },
        {
          driverId: "sainz",
          permanentNumber: "55",
          code: "SAI",
          url: "http://en.wikipedia.org/wiki/Carlos_Sainz_Jr.",
          givenName: "Carlos",
          familyName: "Sainz",
          dateOfBirth: "1994-09-01",
          nationality: "Spanish"
        },
        {
          driverId: "ocon",
          permanentNumber: "31",
          code: "OCO",
          url: "http://en.wikipedia.org/wiki/Esteban_Ocon",
          givenName: "Esteban",
          familyName: "Ocon",
          dateOfBirth: "1996-09-17",
          nationality: "French"
        },
        {
          driverId: "bortoleto",
          permanentNumber: "5",
          code: "BOR",
          url: "http://en.wikipedia.org/wiki/Gabriel_Bortoleto",
          givenName: "Gabriel",
          familyName: "Bortoleto",
          dateOfBirth: "2004-10-14",
          nationality: "Brazilian"
        },
      ]
    }
  }
};

// ============ STUBBED CONSTRUCTORS (2025 Season) ============
export const mockConstructorsApiResponse: F1ApiResponse<ConstructorTableResponse> = {
  MRData: {
    xmlns: "",
    series: "f1",
    url: "http://api.jolpi.ca/ergast/f1/2025/constructors/",
    limit: "30",
    offset: "0",
    total: "10",
    ConstructorTable: {
      season: "2025",
      Constructors: [
        {
          constructorId: "red_bull",
          url: "http://en.wikipedia.org/wiki/Red_Bull_Racing",
          name: "Red Bull",
          nationality: "Austrian"
        },
        {
          constructorId: "ferrari",
          url: "http://en.wikipedia.org/wiki/Scuderia_Ferrari",
          name: "Ferrari",
          nationality: "Italian"
        },
        {
          constructorId: "mercedes",
          url: "http://en.wikipedia.org/wiki/Mercedes-Benz_in_Formula_One",
          name: "Mercedes",
          nationality: "German"
        },
        {
          constructorId: "mclaren",
          url: "http://en.wikipedia.org/wiki/McLaren",
          name: "McLaren",
          nationality: "British"
        },
        {
          constructorId: "aston_martin",
          url: "http://en.wikipedia.org/wiki/Aston_Martin_in_Formula_One",
          name: "Aston Martin",
          nationality: "British"
        },
        {
          constructorId: "alpine",
          url: "http://en.wikipedia.org/wiki/Alpine_F1_Team",
          name: "Alpine",
          nationality: "French"
        },
        {
          constructorId: "rb",
          url: "http://en.wikipedia.org/wiki/RB_Formula_One_Team",
          name: "RB",
          nationality: "Italian"
        },
        {
          constructorId: "sauber",
          url: "http://en.wikipedia.org/wiki/Sauber_Motorsport",
          name: "Kick Sauber",
          nationality: "Swiss"
        },
        {
          constructorId: "williams",
          url: "http://en.wikipedia.org/wiki/Williams_Grand_Prix_Engineering",
          name: "Williams",
          nationality: "British"
        },
        {
          constructorId: "haas",
          url: "http://en.wikipedia.org/wiki/Haas_F1_Team",
          name: "Haas F1 Team",
          nationality: "American"
        }
      ]
    }
  }
};

// ============ STUBBED CIRCUITS ============
export const mockCircuitsApiResponse: F1ApiResponse<CircuitTableResponse> = {
  MRData: {
    xmlns: "",
    series: "f1",
    url: "http://api.jolpi.ca/ergast/f1/2025/circuits/",
    limit: "30",
    offset: "0",
    total: "24",
    CircuitTable: {
      Circuits: [
        {
          circuitId: "bahrain",
          url: "http://en.wikipedia.org/wiki/Bahrain_International_Circuit",
          circuitName: "Bahrain International Circuit",
          Location: { lat: "26.0325", long: "50.5106", locality: "Sakhir", country: "Bahrain" }
        },
        {
          circuitId: "jeddah",
          url: "http://en.wikipedia.org/wiki/Jeddah_Corniche_Circuit",
          circuitName: "Jeddah Corniche Circuit",
          Location: { lat: "21.6319", long: "39.1044", locality: "Jeddah", country: "Saudi Arabia" }
        },
        {
          circuitId: "albert_park",
          url: "http://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit",
          circuitName: "Albert Park Grand Prix Circuit",
          Location: { lat: "-37.8497", long: "144.968", locality: "Melbourne", country: "Australia" }
        },
        {
          circuitId: "suzuka",
          url: "http://en.wikipedia.org/wiki/Suzuka_Circuit",
          circuitName: "Suzuka Circuit",
          Location: { lat: "34.8431", long: "136.541", locality: "Suzuka", country: "Japan" }
        },
        {
          circuitId: "shanghai",
          url: "http://en.wikipedia.org/wiki/Shanghai_International_Circuit",
          circuitName: "Shanghai International Circuit",
          Location: { lat: "31.3389", long: "121.22", locality: "Shanghai", country: "China" }
        },
        {
          circuitId: "miami",
          url: "http://en.wikipedia.org/wiki/Miami_International_Autodrome",
          circuitName: "Miami International Autodrome",
          Location: { lat: "25.9581", long: "-80.2389", locality: "Miami", country: "USA" }
        },
        {
          circuitId: "imola",
          url: "http://en.wikipedia.org/wiki/Autodromo_Enzo_e_Dino_Ferrari",
          circuitName: "Autodromo Enzo e Dino Ferrari",
          Location: { lat: "44.3439", long: "11.7167", locality: "Imola", country: "Italy" }
        },
        {
          circuitId: "monaco",
          url: "http://en.wikipedia.org/wiki/Circuit_de_Monaco",
          circuitName: "Circuit de Monaco",
          Location: { lat: "43.7347", long: "7.42056", locality: "Monte-Carlo", country: "Monaco" }
        },
        {
          circuitId: "catalunya",
          url: "http://en.wikipedia.org/wiki/Circuit_de_Barcelona-Catalunya",
          circuitName: "Circuit de Barcelona-Catalunya",
          Location: { lat: "41.57", long: "2.26111", locality: "Montmeló", country: "Spain" }
        },
        {
          circuitId: "villeneuve",
          url: "http://en.wikipedia.org/wiki/Circuit_Gilles_Villeneuve",
          circuitName: "Circuit Gilles Villeneuve",
          Location: { lat: "45.5", long: "-73.5228", locality: "Montreal", country: "Canada" }
        },
        {
          circuitId: "red_bull_ring",
          url: "http://en.wikipedia.org/wiki/Red_Bull_Ring",
          circuitName: "Red Bull Ring",
          Location: { lat: "47.2197", long: "14.7647", locality: "Spielberg", country: "Austria" }
        },
        {
          circuitId: "silverstone",
          url: "http://en.wikipedia.org/wiki/Silverstone_Circuit",
          circuitName: "Silverstone Circuit",
          Location: { lat: "52.0786", long: "-1.01694", locality: "Silverstone", country: "UK" }
        },
        {
          circuitId: "hungaroring",
          url: "http://en.wikipedia.org/wiki/Hungaroring",
          circuitName: "Hungaroring",
          Location: { lat: "47.5789", long: "19.2486", locality: "Budapest", country: "Hungary" }
        },
        {
          circuitId: "spa",
          url: "http://en.wikipedia.org/wiki/Circuit_de_Spa-Francorchamps",
          circuitName: "Circuit de Spa-Francorchamps",
          Location: { lat: "50.4372", long: "5.97139", locality: "Spa", country: "Belgium" }
        },
        {
          circuitId: "zandvoort",
          url: "http://en.wikipedia.org/wiki/Circuit_Zandvoort",
          circuitName: "Circuit Zandvoort",
          Location: { lat: "52.3888", long: "4.54092", locality: "Zandvoort", country: "Netherlands" }
        },
        {
          circuitId: "monza",
          url: "http://en.wikipedia.org/wiki/Autodromo_Nazionale_Monza",
          circuitName: "Autodromo Nazionale Monza",
          Location: { lat: "45.6156", long: "9.28111", locality: "Monza", country: "Italy" }
        },
        {
          circuitId: "baku",
          url: "http://en.wikipedia.org/wiki/Baku_City_Circuit",
          circuitName: "Baku City Circuit",
          Location: { lat: "40.3725", long: "49.8533", locality: "Baku", country: "Azerbaijan" }
        },
        {
          circuitId: "marina_bay",
          url: "http://en.wikipedia.org/wiki/Marina_Bay_Street_Circuit",
          circuitName: "Marina Bay Street Circuit",
          Location: { lat: "1.2914", long: "103.864", locality: "Marina Bay", country: "Singapore" }
        },
        {
          circuitId: "americas",
          url: "http://en.wikipedia.org/wiki/Circuit_of_the_Americas",
          circuitName: "Circuit of the Americas",
          Location: { lat: "30.1328", long: "-97.6411", locality: "Austin", country: "USA" }
        },
        {
          circuitId: "rodriguez",
          url: "http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez",
          circuitName: "Autódromo Hermanos Rodríguez",
          Location: { lat: "19.4042", long: "-99.0907", locality: "Mexico City", country: "Mexico" }
        },
        {
          circuitId: "interlagos",
          url: "http://en.wikipedia.org/wiki/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace",
          circuitName: "Autódromo José Carlos Pace",
          Location: { lat: "-23.7036", long: "-46.6997", locality: "São Paulo", country: "Brazil" }
        },
        {
          circuitId: "vegas",
          url: "http://en.wikipedia.org/wiki/Las_Vegas_Strip_Circuit",
          circuitName: "Las Vegas Strip Circuit",
          Location: { lat: "36.1147", long: "-115.173", locality: "Las Vegas", country: "USA" }
        },
        {
          circuitId: "losail",
          url: "http://en.wikipedia.org/wiki/Losail_International_Circuit",
          circuitName: "Losail International Circuit",
          Location: { lat: "25.49", long: "51.4542", locality: "Al Daayen", country: "Qatar" }
        },
        {
          circuitId: "yas_marina",
          url: "http://en.wikipedia.org/wiki/Yas_Marina_Circuit",
          circuitName: "Yas Marina Circuit",
          Location: { lat: "24.4672", long: "54.6031", locality: "Abu Dhabi", country: "UAE" }
        }
      ]
    }
  }
};

// ============ STUBBED 2025 RACE CALENDAR ============
export const mockRacesApiResponse: F1ApiResponse<RaceTableResponse> = {
  MRData: {
    xmlns: "",
    series: "f1",
    url: "http://api.jolpi.ca/ergast/f1/2025/",
    limit: "30",
    offset: "0",
    total: "24",
    RaceTable: {
      season: "2025",
      Races: [
        {
          season: "2025",
          round: "1",
          url: "https://en.wikipedia.org/wiki/2025_Australian_Grand_Prix",
          raceName: "Australian Grand Prix",
          Circuit: {
            circuitId: "albert_park",
            url: "http://en.wikipedia.org/wiki/Melbourne_Grand_Prix_Circuit",
            circuitName: "Albert Park Grand Prix Circuit",
            Location: { lat: "-37.8497", long: "144.968", locality: "Melbourne", country: "Australia" }
          },
          date: "2025-03-16",
          time: "04:00:00Z",
          FirstPractice: { date: "2025-03-14", time: "01:30:00Z" },
          SecondPractice: { date: "2025-03-14", time: "05:00:00Z" },
          ThirdPractice: { date: "2025-03-15", time: "01:30:00Z" },
          Qualifying: { date: "2025-03-15", time: "05:00:00Z" }
        },
        {
          season: "2025",
          round: "2",
          url: "https://en.wikipedia.org/wiki/2025_Chinese_Grand_Prix",
          raceName: "Chinese Grand Prix",
          Circuit: {
            circuitId: "shanghai",
            url: "http://en.wikipedia.org/wiki/Shanghai_International_Circuit",
            circuitName: "Shanghai International Circuit",
            Location: { lat: "31.3389", long: "121.22", locality: "Shanghai", country: "China" }
          },
          date: "2025-03-23",
          time: "07:00:00Z",
          FirstPractice: { date: "2025-03-21", time: "03:30:00Z" },
          SprintQualifying: { date: "2025-03-21", time: "07:30:00Z" },
          Sprint: { date: "2025-03-22", time: "03:00:00Z" },
          Qualifying: { date: "2025-03-22", time: "07:00:00Z" }
        },
        {
          season: "2025",
          round: "3",
          url: "https://en.wikipedia.org/wiki/2025_Japanese_Grand_Prix",
          raceName: "Japanese Grand Prix",
          Circuit: {
            circuitId: "suzuka",
            url: "http://en.wikipedia.org/wiki/Suzuka_Circuit",
            circuitName: "Suzuka Circuit",
            Location: { lat: "34.8431", long: "136.541", locality: "Suzuka", country: "Japan" }
          },
          date: "2025-04-06",
          time: "05:00:00Z",
          FirstPractice: { date: "2025-04-04", time: "02:30:00Z" },
          SecondPractice: { date: "2025-04-04", time: "06:00:00Z" },
          ThirdPractice: { date: "2025-04-05", time: "02:30:00Z" },
          Qualifying: { date: "2025-04-05", time: "06:00:00Z" }
        },
        {
          season: "2025",
          round: "4",
          url: "https://en.wikipedia.org/wiki/2025_Bahrain_Grand_Prix",
          raceName: "Bahrain Grand Prix",
          Circuit: {
            circuitId: "bahrain",
            url: "http://en.wikipedia.org/wiki/Bahrain_International_Circuit",
            circuitName: "Bahrain International Circuit",
            Location: { lat: "26.0325", long: "50.5106", locality: "Sakhir", country: "Bahrain" }
          },
          date: "2025-04-13",
          time: "15:00:00Z",
          FirstPractice: { date: "2025-04-11", time: "11:30:00Z" },
          SecondPractice: { date: "2025-04-11", time: "15:00:00Z" },
          ThirdPractice: { date: "2025-04-12", time: "12:30:00Z" },
          Qualifying: { date: "2025-04-12", time: "16:00:00Z" }
        },
        {
          season: "2025",
          round: "5",
          url: "https://en.wikipedia.org/wiki/2025_Saudi_Arabian_Grand_Prix",
          raceName: "Saudi Arabian Grand Prix",
          Circuit: {
            circuitId: "jeddah",
            url: "http://en.wikipedia.org/wiki/Jeddah_Corniche_Circuit",
            circuitName: "Jeddah Corniche Circuit",
            Location: { lat: "21.6319", long: "39.1044", locality: "Jeddah", country: "Saudi Arabia" }
          },
          date: "2025-04-20",
          time: "17:00:00Z",
          FirstPractice: { date: "2025-04-18", time: "13:30:00Z" },
          SecondPractice: { date: "2025-04-18", time: "17:00:00Z" },
          ThirdPractice: { date: "2025-04-19", time: "13:30:00Z" },
          Qualifying: { date: "2025-04-19", time: "17:00:00Z" }
        },
        {
          season: "2025",
          round: "6",
          url: "https://en.wikipedia.org/wiki/2025_Miami_Grand_Prix",
          raceName: "Miami Grand Prix",
          Circuit: {
            circuitId: "miami",
            url: "http://en.wikipedia.org/wiki/Miami_International_Autodrome",
            circuitName: "Miami International Autodrome",
            Location: { lat: "25.9581", long: "-80.2389", locality: "Miami", country: "USA" }
          },
          date: "2025-05-04",
          time: "20:00:00Z",
          FirstPractice: { date: "2025-05-02", time: "18:30:00Z" },
          SprintQualifying: { date: "2025-05-02", time: "22:30:00Z" },
          Sprint: { date: "2025-05-03", time: "16:00:00Z" },
          Qualifying: { date: "2025-05-03", time: "20:00:00Z" }
        },
        {
          season: "2025",
          round: "7",
          url: "https://en.wikipedia.org/wiki/2025_Emilia_Romagna_Grand_Prix",
          raceName: "Emilia Romagna Grand Prix",
          Circuit: {
            circuitId: "imola",
            url: "http://en.wikipedia.org/wiki/Autodromo_Enzo_e_Dino_Ferrari",
            circuitName: "Autodromo Enzo e Dino Ferrari",
            Location: { lat: "44.3439", long: "11.7167", locality: "Imola", country: "Italy" }
          },
          date: "2025-05-18",
          time: "13:00:00Z",
          FirstPractice: { date: "2025-05-16", time: "11:30:00Z" },
          SecondPractice: { date: "2025-05-16", time: "15:00:00Z" },
          ThirdPractice: { date: "2025-05-17", time: "10:30:00Z" },
          Qualifying: { date: "2025-05-17", time: "14:00:00Z" }
        },
        {
          season: "2025",
          round: "8",
          url: "https://en.wikipedia.org/wiki/2025_Monaco_Grand_Prix",
          raceName: "Monaco Grand Prix",
          Circuit: {
            circuitId: "monaco",
            url: "http://en.wikipedia.org/wiki/Circuit_de_Monaco",
            circuitName: "Circuit de Monaco",
            Location: { lat: "43.7347", long: "7.42056", locality: "Monte-Carlo", country: "Monaco" }
          },
          date: "2025-05-25",
          time: "13:00:00Z",
          FirstPractice: { date: "2025-05-23", time: "11:30:00Z" },
          SecondPractice: { date: "2025-05-23", time: "15:00:00Z" },
          ThirdPractice: { date: "2025-05-24", time: "10:30:00Z" },
          Qualifying: { date: "2025-05-24", time: "14:00:00Z" }
        },
        {
          season: "2025",
          round: "9",
          url: "https://en.wikipedia.org/wiki/2025_Spanish_Grand_Prix",
          raceName: "Spanish Grand Prix",
          Circuit: {
            circuitId: "catalunya",
            url: "http://en.wikipedia.org/wiki/Circuit_de_Barcelona-Catalunya",
            circuitName: "Circuit de Barcelona-Catalunya",
            Location: { lat: "41.57", long: "2.26111", locality: "Montmeló", country: "Spain" }
          },
          date: "2025-06-01",
          time: "13:00:00Z",
          FirstPractice: { date: "2025-05-30", time: "11:30:00Z" },
          SecondPractice: { date: "2025-05-30", time: "15:00:00Z" },
          ThirdPractice: { date: "2025-05-31", time: "10:30:00Z" },
          Qualifying: { date: "2025-05-31", time: "14:00:00Z" }
        },
        {
          season: "2025",
          round: "10",
          url: "https://en.wikipedia.org/wiki/2025_Canadian_Grand_Prix",
          raceName: "Canadian Grand Prix",
          Circuit: {
            circuitId: "villeneuve",
            url: "http://en.wikipedia.org/wiki/Circuit_Gilles_Villeneuve",
            circuitName: "Circuit Gilles Villeneuve",
            Location: { lat: "45.5", long: "-73.5228", locality: "Montreal", country: "Canada" }
          },
          date: "2025-06-15",
          time: "18:00:00Z",
          FirstPractice: { date: "2025-06-13", time: "17:30:00Z" },
          SecondPractice: { date: "2025-06-13", time: "21:00:00Z" },
          ThirdPractice: { date: "2025-06-14", time: "16:30:00Z" },
          Qualifying: { date: "2025-06-14", time: "20:00:00Z" }
        },
        {
          season: "2025",
          round: "11",
          url: "https://en.wikipedia.org/wiki/2025_Austrian_Grand_Prix",
          raceName: "Austrian Grand Prix",
          Circuit: {
            circuitId: "red_bull_ring",
            url: "http://en.wikipedia.org/wiki/Red_Bull_Ring",
            circuitName: "Red Bull Ring",
            Location: { lat: "47.2197", long: "14.7647", locality: "Spielberg", country: "Austria" }
          },
          date: "2025-06-29",
          time: "13:00:00Z",
          FirstPractice: { date: "2025-06-27", time: "10:30:00Z" },
          SprintQualifying: { date: "2025-06-27", time: "14:30:00Z" },
          Sprint: { date: "2025-06-28", time: "10:00:00Z" },
          Qualifying: { date: "2025-06-28", time: "14:00:00Z" }
        },
        {
          season: "2025",
          round: "12",
          url: "https://en.wikipedia.org/wiki/2025_British_Grand_Prix",
          raceName: "British Grand Prix",
          Circuit: {
            circuitId: "silverstone",
            url: "http://en.wikipedia.org/wiki/Silverstone_Circuit",
            circuitName: "Silverstone Circuit",
            Location: { lat: "52.0786", long: "-1.01694", locality: "Silverstone", country: "UK" }
          },
          date: "2025-07-06",
          time: "14:00:00Z",
          FirstPractice: { date: "2025-07-04", time: "11:30:00Z" },
          SecondPractice: { date: "2025-07-04", time: "15:00:00Z" },
          ThirdPractice: { date: "2025-07-05", time: "10:30:00Z" },
          Qualifying: { date: "2025-07-05", time: "14:00:00Z" }
        }
      ]
    }
  }
};

// ============ STUBBED DRIVER STANDINGS ============
export const mockDriverStandingsApiResponse: F1ApiResponse<DriverStandingsTableResponse> = {
  MRData: {
    xmlns: "",
    series: "f1",
    url: "http://api.jolpi.ca/ergast/f1/current/driverStandings/",
    limit: "30",
    offset: "0",
    total: "20",
    StandingsTable: {
      season: "2025",
      StandingsLists: [
        {
          season: "2025",
          round: "3",
          DriverStandings: [
            {
              position: "1",
              positionText: "1",
              points: "69",
              wins: "2",
              Driver: mockDriversApiResponse.MRData.DriverTable.Drivers[0], // Verstappen
              Constructors: [mockConstructorsApiResponse.MRData.ConstructorTable.Constructors[0]] // Red Bull
            },
            {
              position: "2",
              positionText: "2",
              points: "54",
              wins: "1",
              Driver: mockDriversApiResponse.MRData.DriverTable.Drivers[6], // Norris
              Constructors: [mockConstructorsApiResponse.MRData.ConstructorTable.Constructors[3]] // McLaren
            },
            {
              position: "3",
              positionText: "3",
              points: "47",
              wins: "0",
              Driver: mockDriversApiResponse.MRData.DriverTable.Drivers[2], // Leclerc
              Constructors: [mockConstructorsApiResponse.MRData.ConstructorTable.Constructors[1]] // Ferrari
            },
            {
              position: "4",
              positionText: "4",
              points: "42",
              wins: "0",
              Driver: mockDriversApiResponse.MRData.DriverTable.Drivers[7], // Piastri
              Constructors: [mockConstructorsApiResponse.MRData.ConstructorTable.Constructors[3]] // McLaren
            },
            {
              position: "5",
              positionText: "5",
              points: "38",
              wins: "0",
              Driver: mockDriversApiResponse.MRData.DriverTable.Drivers[3], // Hamilton
              Constructors: [mockConstructorsApiResponse.MRData.ConstructorTable.Constructors[1]] // Ferrari
            }
          ]
        }
      ]
    }
  }
};

// ============ STUBBED RACE RESULTS (Completed Race) ============
export const mockRaceResultsApiResponse: F1ApiResponse<RaceResultsTableResponse> = {
  MRData: {
    xmlns: "",
    series: "f1",
    url: "http://api.jolpi.ca/ergast/f1/2025/1/results/",
    limit: "30",
    offset: "0",
    total: "20",
    RaceTable: {
      season: "2025",
      round: "1",
      Races: [
        {
          season: "2025",
          round: "1",
          url: "https://en.wikipedia.org/wiki/2025_Australian_Grand_Prix",
          raceName: "Australian Grand Prix",
          Circuit: mockCircuitsApiResponse.MRData.CircuitTable.Circuits[2], // Albert Park
          date: "2025-03-16",
          time: "04:00:00Z",
          Results: [
            {
              number: "4",
              position: "1",
              positionText: "1",
              points: "25",
              Driver: mockDriversApiResponse.MRData.DriverTable.Drivers[6], // Norris
              Constructor: mockConstructorsApiResponse.MRData.ConstructorTable.Constructors[3], // McLaren
              grid: "1",
              laps: "58",
              status: "Finished",
              Time: { millis: "5234543", time: "1:27:14.543" },
              FastestLap: {
                rank: "1",
                lap: "52",
                Time: { time: "1:19.813" },
                AverageSpeed: { units: "kph", speed: "243.567" }
              }
            },
            {
              number: "1",
              position: "2",
              positionText: "2",
              points: "18",
              Driver: mockDriversApiResponse.MRData.DriverTable.Drivers[0], // Verstappen
              Constructor: mockConstructorsApiResponse.MRData.ConstructorTable.Constructors[0], // Red Bull
              grid: "3",
              laps: "58",
              status: "Finished",
              Time: { millis: "5237000", time: "+2.457" }
            },
            {
              number: "16",
              position: "3",
              positionText: "3",
              points: "15",
              Driver: mockDriversApiResponse.MRData.DriverTable.Drivers[2], // Leclerc
              Constructor: mockConstructorsApiResponse.MRData.ConstructorTable.Constructors[1], // Ferrari
              grid: "2",
              laps: "58",
              status: "Finished",
              Time: { millis: "5241000", time: "+6.457" }
            }
          ]
        }
      ]
    }
  }
};

// ============ CONSTRUCTOR-DRIVER MAPPING FOR BETTING ============
export const driverConstructorMap: Record<string, string> = {
  "max_verstappen": "red_bull",
  "lawson": "red_bull",
  "leclerc": "ferrari",
  "hamilton": "ferrari",
  "russell": "mercedes",
  "antonelli": "mercedes",
  "norris": "mclaren",
  "piastri": "mclaren",
  "alonso": "aston_martin",
  "stroll": "aston_martin",
  "gasly": "alpine",
  "doohan": "alpine",
  "tsunoda": "rb",
  "hadjar": "rb",
  "hulkenberg": "sauber",
  "bortoleto": "sauber",
  "albon": "williams",
  "sainz": "williams",
  "ocon": "haas",
  "bearman": "haas",
};

// Team colors for UI
export const teamColors: Record<string, { primary: string; secondary: string }> = {
  "red_bull": { primary: "#1E41FF", secondary: "#FFD700" },
  "ferrari": { primary: "#DC0000", secondary: "#FFF500" },
  "mercedes": { primary: "#00D2BE", secondary: "#000000" },
  "mclaren": { primary: "#FF8700", secondary: "#000000" },
  "aston_martin": { primary: "#006F62", secondary: "#CEDC00" },
  "alpine": { primary: "#0090FF", secondary: "#FF69B4" },
  "rb": { primary: "#2B4562", secondary: "#FFFFFF" },
  "sauber": { primary: "#52E252", secondary: "#000000" },
  "williams": { primary: "#005AFF", secondary: "#00A0DE" },
  "haas": { primary: "#FFFFFF", secondary: "#B6BABD" },
};
