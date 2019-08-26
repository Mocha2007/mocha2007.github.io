var a = 13.799e9;
var i;
var currentyear = ((new Date()).getFullYear());
var year = 86400*(currentyear%400?(currentyear%100?(currentyear%4?365:366):365):366);
var cye = new Date(currentyear+"-01-01T01:00:00"+String(new Date()).slice(28,33))/1000; // current year epoch - jan 1 XXXX 00:00 utc
var debug = false; // enable to see all events at any time

function timeSinceYear(){
	"use strict";
	return (new Date()/1000)-cye;
}

function toYear(ms){
	"use strict";
	return ms/1000/60/60/24/365.25; // ditto
}

function diff(epoch){
	"use strict";
	return toYear(Date.now()-epoch*1000);
}

// Jan	~ until Paleoproterozoic
// Feb	~ until Permian
// Mar	~ until Eocene
// Apr	~ until Pliocene
// May	~ until Chibanian
// Jun	~ until Tarantian
// Jul	~ until 20 kya
// Aug	~ until Iron Age
// Sep	~ until Enlightenment
// Oct	~ until 50 years ago
// Nov	~ until 5 years ago
// Dec	~ until 1 month ago
var events = [ // MUST BE REVERSE CHRONO ORDER!!! time before 01 jan 2018
[a,'<a href="https://en.wikipedia.org/wiki/Big_Bang">Big Bang</a>'],
[a-380e3,'<a href="https://en.wikipedia.org/wiki/Chronology_of_the_universe#Dark_Ages">Cosmic Dark Ages</a>'],
[a-1e7,'<a href="https://en.wikipedia.org/wiki/Chronology_of_the_universe#Habitable_epoch">Habitable Epoch</a>'],
[a-15e7,'<a href="https://en.wikipedia.org/wiki/Reionization">Reionization</a>'],
[13.4e9,'Formation of <a href="https://en.wikipedia.org/wiki/GN-z11">GN-z11</a>, one of the oldest known galaxies'],
[a-630e6,'<a href="https://en.wikipedia.org/wiki/GRB_090423">GRB 090423</a>, one of the oldest supernovae'],
[a-670e6,'Formation of <a href="https://en.wikipedia.org/wiki/EGS-zs8-1">EGS-zs8-1</a>, one of the oldest known galaxies'],
[13.2e9,'Depth of the <a href="https://en.wikipedia.org/wiki/Hubble_Ultra-Deep_Field#Hubble_eXtreme_Deep_Field">Hubble Extreme Deep Field</a>'],
[12.8e9,'Formation of <a href="https://en.wikipedia.org/wiki/HCM-6A">HCM-6A</a>, the oldest known regular galaxy'],
[12.7e9,'Formation of the <a href="https://en.wikipedia.org/wiki/Milky_Way">Milky Way</a>'],
[12.67e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_12">Messier 12</a>'],
[12.54e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_80">Messier 80</a>'],
[12.3e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_55">Messier 55</a>'],
[11.78e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_62">Messier 62</a>'],
[11.52e9,'Formation of <a href="https://en.wikipedia.org/wiki/Omega_Centauri">Omega Centauri</a>'],
[11.39e9,'Formation of <a href="https://en.wikipedia.org/wiki/Messier_10">Messier 10</a>'],
[10.8e9,'Formation of <a href="https://en.wikipedia.org/wiki/Gliese_581_planetary_system">Gliese 581</a>'],
[1e10,'Formation of <a href="https://en.wikipedia.org/wiki/Barnard\'s_Star">Barnard\'s Star</a>'],
[9.8e9,'Formation of the <a href="https://en.wikipedia.org/wiki/Andromeda_galaxy">Andromeda Galaxy</a>'],
[8.8e9,'Formation of the first <a href="https://en.wikipedia.org/wiki/Population_I">Population I</a> stars'],
[6e9,'Beginning of the <a href="https://en.wikipedia.org/wiki/Dark-energy_dominated_era">Dark-energy Dominated Era</a>'],
[5.6e9,'Formation of <a href="https://en.wikipedia.org/wiki/Tau_Ceti">Tau Ceti</a>'],
[4.85e9,'Formation of the <a href="https://en.wikipedia.org/wiki/Alpha_Centauri">Alpha Centauri</a> System'],
// SOLAR SYSTEM
[4.6e9,'Formation of the <a href="https://en.wikipedia.org/wiki/Solar_System">Solar System</a>'],
[4.5682e9,'Formation of the <a href="https://en.wikipedia.org/wiki/Sun">Sun</a>'],
[4.56717e9,'Formation of the <a href="https://en.wikipedia.org/wiki/Jovian_planets">Jovian Planets</a>'],
[4.545e9,'Formation of the Inner Solar System'],
[4.533e9,'<a href="https://en.wikipedia.org/wiki/Giant-impact_hypothesis">Formation</a> of the <a href="https://en.wikipedia.org/wiki/Earth">Earth</a>'],
[4.529e9,'Mars collides with a pluto-sized planetoid'],
[4.5e9,'Formation of the <a href="https://en.wikipedia.org/wiki/Kuiper_Belt">Kuiper Belt</a> and <a href="https://en.wikipedia.org/wiki/Oort_Cloud">Oort Cloud</a>'],
[4.404e9,'Water Appears on Earth'],
[4.3e9,'Impact creates the <a href="https://en.wikipedia.org/wiki/Aitken_Basin">Aitken Basin</a> on the Moon'],
[4.1e9,'Beginning of the <a href="https://en.wikipedia.org/wiki/Late_Heavy_Bombardment">Late Heavy Bombardment</a>'],
[4.1e9,'Impact creates <a href="https://en.wikipedia.org/wiki/Herschel_(Mimantean_crater)">Herscel Crater</a> on Mimas'],
[4e9,'Beginning of the <a href="https://en.wikipedia.org/wiki/Archean">Archean</a>'],
[3.938e9,'Formation of <a href="https://en.wikipedia.org/wiki/Mare_Imbrium">Mare Imbrium</a>'],
[3.92e9,'Impact creates the <a href="https://en.wikipedia.org/wiki/Nectaris_Basin">Nectaris Basin</a> on the Moon'],
[3.9e9,'Impact creates <a href="https://en.wikipedia.org/wiki/Rembrandt_(crater)">Rembrandt Crater</a> on Mercury, the second-largest crater on Mercury'],
[3.85e9,'Impact creates <a href="https://en.wikipedia.org/wiki/Caloris_Planitia">Caloris Planitia</a> on Mercury, the largest crater on Mercury'],
[3.84e9,'Impact creates the <a href="https://en.wikipedia.org/wiki/Orientale_Basin">Orientale Basin</a> on the Moon'],
[3.8e9,'End of the Late Heavy Bombardment'],
[3.465e9,'Life forms on Earth'],
[3.2e9,'Earliest Photosynthesis'],
[3.2e9,'Impact creates the <a href="https://en.wikipedia.org/wiki/Eratosthenes_(crater)">Eratosthenes Crater</a> on the Moon'],
[2.5e9,'Beginning of the <a href="https://en.wikipedia.org/wiki/Proterozoic">Proterozoic</a>'],
[2.45e9,'<a href="https://en.wikipedia.org/wiki/Great_Oxygenation_Event">Great Oxygenation Event</a>'],
[2.4e9,'<a href="https://en.wikipedia.org/wiki/Huronian_glaciation">Huronian Glaciation</a>'],
[2.1e9,'First <a href="https://en.wikipedia.org/wiki/Eukaryote">Eukaryotes</a>'],
[2.023e9,'<a href="https://en.wikipedia.org/wiki/Vredefort_crater">Vredefort Impact</a>'],
[1.849e9,'<a href="https://en.wikipedia.org/wiki/Sudbury_Basin_crater">Sudbury Impact</a>'],
[1.7e9,'First <a href="https://en.wikipedia.org/wiki/Mitochondrion">Mitochondia</a>'],
[1.6e9,'First Multicellular Life on Earth'],
[1.2e9,'First Sexual Reproduction'],
[1e9,'Beginning of the <a href="https://en.wikipedia.org/wiki/Tonian">Tonian</a> period of the <a href="https://en.wikipedia.org/wiki/Neoproterozoic">Neoproterozoic</a>'],
[800e6,'Impact creates the <a href="https://en.wikipedia.org/wiki/Copernicus_(lunar_crater)">Copernicus Crater</a> on the Moon'],
[760e6,'<a href="https://en.wikipedia.org/wiki/Otavia">Otavia</a>'],
[750e6,'First <a href="https://en.wikipedia.org/wiki/Protozoa">Protozoa</a> appear'],
[750e6,'<a href="https://en.wikipedia.org/wiki/Kaigas">Kaigas Glaciation</a>'],
[720e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Cryogenian">Cryogenian</a> period'],
[715e6,'<a href="https://en.wikipedia.org/wiki/Sturtian_glaciation">Sturtian Glaciation</a>'],
[670e6,'First <a href="https://en.wikipedia.org/wiki/Animals">Animals</a>'],
[660e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Cadomian_orogeny">Cadomian Orogeny</a>'],
[650e6,'<a href="https://en.wikipedia.org/wiki/Marinoan_glaciation">Marinoan Glaciation</a>'],
[635e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Ediacaran">Ediacaran</a> period'],
[600e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Pan-African_orogeny">Pan-African Orogeny</a>'],
[580e6,'<a href="https://en.wikipedia.org/wiki/Acraman_crater">Acraman Impact</a>'],
[579.63e6,'<a href="https://en.wikipedia.org/wiki/Gaskiers_glaciation">Gaskiers Glaciation</a>'],
[560e6,'Earliest <a href="https://en.wikipedia.org/wiki/Fungus">Fungi</a>'],
[550e6,'Extinction of <i><a href="https://en.wikipedia.org/wiki/Trilobozoa">Trilobozoa</a></i>'],
[541e6,'<a href="https://en.wikipedia.org/wiki/Cambrian_explosion">Cambrian Explosion</a>'],
[530e6,'Earliest <a href="https://en.wikipedia.org/wiki/Fish">Fish</a>'],
[521e6,'Earliest <a href="https://en.wikipedia.org/wiki/Trilobite">Trilobites</a>'],
[508e6,'Formation of the <a href="https://en.wikipedia.org/wiki/Burgess_Shale">Burgess Shale</a>'],
[485.4e6,'Cambrian-Ordovician Extinction Event'],
[467.5e6,'<a href="https://en.wikipedia.org/wiki/Ordovician_meteor_event">Ordovician Meteor Event</a>'],
[466e6,'First land plant spores'],
[433.4e6,'<a href="https://en.wikipedia.org/wiki/Ireviken_event">Ireviken Event</a>'],
[430e6,'Final Ordovician–Silurian Extinction Event'],
[428e6,'Earliest Land Animals'],
[427e6,'<a href="https://en.wikipedia.org/wiki/Mulde_event">Mulde Event</a>'],
[424e6,'<a href="https://en.wikipedia.org/wiki/Lau_event">Lau Event</a>'],
[420e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Devonian">Devonian</a> period'],
[410e6,'<a href="https://en.wikipedia.org/wiki/Rhynie_chert">Rhynie Chert</a>'],
[404e6,'<a href="https://en.wikipedia.org/wiki/Hunsrück_Slate">Hunsrück Slate</a>'],
[396e6,'Earliest <a href="https://en.wikipedia.org/wiki/Insect">Insects</a>'],
[377.2e6,'<a href="https://en.wikipedia.org/wiki/Late_Devonian_extinction#The_Kellwasser_event">Kelwasser Event</a>'],
[367.5e6,'Late Devonian Extinction Event'],
[358.9e6,'<a href="https://en.wikipedia.org/wiki/Hangenberg_event">Hangenberg Event</a>'],
[335e6,'Pangaea Forms'],
[298.9e6,'End of the <a href="https://en.wikipedia.org/wiki/Carboniferous">Carboniferous</a>'],
[252e6,'Permian-Triassic Extinction Event'],
[245e6,'Earliest <a href="https://en.wikipedia.org/wiki/Fly">Flies</a>'],
[243e6,'<a href="https://en.wikipedia.org/wiki/Scleractinia">Scleractinia</a>'],
[242e6,'Formation of <a href="https://en.wikipedia.org/wiki/Sirius">Sirius</a>'],
[231.4e6,'Earliest <a href="https://en.wikipedia.org/wiki/Dinosaur">Dinosaurs</a>'],
[225e6,'Earliest <a href="https://en.wikipedia.org/wiki/Mammal">Mammals</a>'],
[220e6,'Earliest <a href="https://en.wikipedia.org/wiki/Turtle">Turtles</a>'],
[201.3e6,'Triassic-Jurassic Extinction Event'],
[175e6,'Pangaea Separates'],
[161e6,'Earliest <a href="https://en.wikipedia.org/wiki/Eutheria">Eutherians</a>'],
[145e6,'Beginning of the Cretaceous Period'],
[140e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Sevier_orogeny">Sevier Orogeny</a>'],
[140e6,'Earliest <a href="https://en.wikipedia.org/wiki/Ant">Ants</a>'],
[130e6,'Earliest <a href="https://en.wikipedia.org/wiki/Flowering_plant">Flowering Plants</a>'],
[125e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Cretaceous_Terrestrial_Revolution">Cretaceous Terrestrial Revolution</a>'],
[120e6,'Formation of the <a href="https://en.wikipedia.org/wiki/BP_Structure">BP Structure</a>'],
[115e6,'<a href="https://en.wikipedia.org/wiki/Carswell_crater">Carswell Impact</a>'],
[108e6,'Impact creates the <a href="https://en.wikipedia.org/wiki/Tycho_(lunar_crater)">Tycho Crater</a> on the Moon'],
[100e6,'Earliest <a href="https://en.wikipedia.org/wiki/Bee">Bees</a>'],
[94e6,'Cenomanian-Turonian Boundary Event'],
[90e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Andean_orogeny">Andean Orogeny</a>'],
[80e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Laramide_orogeny">Laramide Orogeny</a>'],
// https://en.wikipedia.org/wiki/Timeline_of_natural_history#Cretaceous_Period
[7e7,'Formation of <a href="https://en.wikipedia.org/wiki/Polaris">Polaris</a>'],
[68e6,'Earliest <a href="https://en.wikipedia.org/wiki/Tyrannosaurus">Tyrannosaurs</a>'],
[66.043e6,'<a href="https://en.wikipedia.org/wiki/Chicxulub_crater">Chicxulub Impact</a>; Cretaceous-Tertiary Extinction Event'],
[65.17e6,'<a href="https://en.wikipedia.org/wiki/Boltysh_crater">Boltysh Impact</a>'],
[56e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Eocene">Eocene</a>'],
[55.5e6,'<a href="https://en.wikipedia.org/wiki/Paleocene–Eocene_Thermal_Maximum">Paleocene-Eocene Thermal Maximum</a>'],
[55e6,'Earliest <a href="https://en.wikipedia.org/wiki/Primate">Primates</a>'],
[54.65e6,'<a href="https://en.wikipedia.org/wiki/Fur_Formation">Fur Formation</a>'],
[52.5e6,'<a href="https://en.wikipedia.org/wiki/London_Clay">London Clay</a>'],
[52e6,'Earliest <a href="https://en.wikipedia.org/wiki/Bat">Bats</a>'],
[45e6,'Australia Splits from Antarctica'],
[45e6,'<a href="https://en.wikipedia.org/wiki/Azolla_event">Azolla Event</a>'],
[42e6,'Earliest <a href="https://en.wikipedia.org/wiki/Carnivora">Carnivorans</a>'],
[40e6,'Earliest <a href="https://en.wikipedia.org/wiki/Simian">Simians</a>'],
[39.75e6,'Earliest <a href="https://en.wikipedia.org/wiki/Canidae">Canids</a>'],
// https://en.wikipedia.org/wiki/List_of_impact_craters_on_Earth#Largest_craters_(10_Ma_or_more)
[39e6,'<a href="https://en.wikipedia.org/wiki/Haughton_impact_crater">Haughton Impact</a>'],
[36.4e6,'<a href="https://en.wikipedia.org/wiki/Mistastin_crater">Mistastin Impact</a>'],
[35e6,'<a href="https://en.wikipedia.org/wiki/Chesapeake_Bay_impact_crater">Chesepeake Bay Impact</a>'],
[35e6,'<a href="https://en.wikipedia.org/wiki/Popigai_crater">Popigai Impact</a>'],
[33.9e6,'Eocene-Oligocene Extinction Event'],
[31.0e6,'Earliest <a href="https://en.wikipedia.org/wiki/Catarrhini">Catarrhini</a>'],
[26.3e6,'<a href="https://en.wikipedia.org/wiki/La_Garita_Caldera">La Garita</a> Eruption'],
[23.03e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Neogene">Neogene</a>'],
[20.4e6,'Earliest <a href="https://en.wikipedia.org/wiki/Ape">Apes</a>'],
[15.7e6,'Earliest <a href="https://en.wikipedia.org/wiki/Hominidae">Great Apes</a>'],
[14.5e6,'Middle Miocene Disruption'],
[14.4e6,'<a href="https://en.wikipedia.org/wiki/Nördlinger_Ries">Nördlinger Ries Impact</a>'],
[8.8e6,'Earliest <a href="https://en.wikipedia.org/wiki/Homininae">African Apes</a>'],
[7e6,'Earliest <i><a href="https://en.wikipedia.org/wiki/Vulpes">Vulpes</a></i> Fossils'],
[6.3e6,'Earliest <a href="https://en.wikipedia.org/wiki/Hominini">Hominins</a>; Human-Chimpanzee common ancestor'],
[6e6,'Earliest <i><a href="https://en.wikipedia.org/wiki/Canis">Canis</a></i> Fossils'],
[5.33e6,'<a href="https://en.wikipedia.org/wiki/Zanclean_flood">Zanclean Flood</a>'],
[5e6,'<a href="https://en.wikipedia.org/wiki/Bigach_crater">Bigach Impact</a>'],
[5e6,'<a href="https://en.wikipedia.org/wiki/Karla_crater">Karla Impact</a>'],
[4e6,'<i><a href="https://en.wikipedia.org/wiki/Australopithecus_anamensis">Australopithecus anamensis</a></i>'],
[3.95e6,'<a href="https://en.wikipedia.org/wiki/Karakul_(Tajikistan)">Karakul Impact</a>'],
[3.9e6,'<i><a href="https://en.wikipedia.org/wiki/Australopithecus_afarensis">Australopithecus afarensis</a></i>'],
[3.6e6,'<a href="https://en.wikipedia.org/wiki/Lake_Elgygytgyn">Elgygytgyn Impact</a>'],
[3.5e6,'<i><a href="https://en.wikipedia.org/wiki/Australopithecus_deyiremeda">Australopithecus deyiremeda</a></i>'],
[3.3e6,'<i><a href="https://en.wikipedia.org/wiki/Australopithecus_africanus">Australopithecus africanus</a></i>'],
[2.588e6,'Beginning of the <a href="https://en.wikipedia.org/wiki/Quaternary">Quaternary</a>'],
[2.3e6,'<i><a href="https://en.wikipedia.org/wiki/Homo_habilis">Homo habilis</a></i>'],
[1.9e6,'<i><a href="https://en.wikipedia.org/wiki/Homo_ergaster">Homo ergaster</a></i>'],
[1.8e6,'<i><a href="https://en.wikipedia.org/wiki/Homo_erectus">Homo erectus</a></i>'],
[1.25e6,'<a href="https://en.wikipedia.org/wiki/Biber-Danube_interglacial">Biber-Danube Interglacial</a>'],
[1.2e6,'<i><a href="https://en.wikipedia.org/wiki/Homo_antecessor">Homo antecessor</a></i>'],
[1.09e6,'<a href="https://en.wikipedia.org/wiki/Jaramillo_normal_event">Jaramillo Normal Event</a>'],
[1.07e6,'<a href="https://en.wikipedia.org/wiki/Lake_Bosumtwi">Lake Bosumtwi Impact</a>'],
[990e3,'<a href="https://en.wikipedia.org/wiki/Jaramillo_reversal">Jaramillo Reversal</a>'],
[975e3,'<a href="https://en.wikipedia.org/wiki/Danube_glaciation">Danube Glaciation</a>'],
[900e3,'<a href="https://en.wikipedia.org/wiki/Zhamanshin_crater">Zhamanshin Impact</a>'],
[790e3,'<a href="https://en.wikipedia.org/wiki/Gunz_(geology)">Gunz Glaciation</a>'],
[781e3,'<a href="https://en.wikipedia.org/wiki/Brunhes–Matuyama_reversal">Brunhes-Matuyama Reversal</a> - most recent geomagnetic reversal'],
[700e3,'<i><a href="https://en.wikipedia.org/wiki/Homo_heidelbergensis">Homo heidelbergensis</a></i>'],
[474e3,'<a href="https://en.wikipedia.org/wiki/Haslach_glaciation">Haslach Glaciation</a>'],
[430e3,'<a href="https://en.wikipedia.org/wiki/Neanderthal">Neanderthals</a>'],
[360e3,'<a href="https://en.wikipedia.org/wiki/Elster_glaciation">Elster Glaciation</a>'],
[315e3,'Modern Humans Evolve'],
[275e3,'Age of <a href="https://en.wikipedia.org/wiki/Y-chromosomal_Adam">Y-Chromosomal Adam</a>'],
[220e3,'<a href="https://en.wikipedia.org/wiki/Tswaing_crater">Tswaing Impact</a>'],
// https://en.wikipedia.org/wiki/Timeline_of_human_prehistory
// HUMAN MIGRATIONS https://upload.wikimedia.org/wikipedia/commons/8/8b/Early_migrations_mercator.svg
[195e3,'Oldest Discovered Human Fossil'],
[190e3,'<i><a href="https://en.wikipedia.org/wiki/Homo_floresiensis">Homo floresiensis</a></i>'],
[180e3,'Impact creates <a href="https://en.wikipedia.org/wiki/Sputnik_Planitia">Sputnik Planitia</a> on Pluto'],
[170e3,'First Clothing'],
[161.3e3,'Origin of <a href="https://en.wikipedia.org/wiki/Haplogroup_A-P305">Haplogroup A1</a>'],
[120e3,'<a href="https://en.wikipedia.org/wiki/Abbassia_Pluvial">Abbassia Pluvial</a> Begins'],
[110e3,'<a href="https://en.wikipedia.org/wiki/Last_glacial_period">Last Glacial Period</a> Begins'],
[90e3,'Abbassia Pluvial Ends'],
[75e3,'<a href="https://en.wikipedia.org/wiki/Toba_catastrophe_theory">Toba Catastrophe</a>'],
[70e3,'Age of <a href="https://en.wikipedia.org/wiki/Haplogroup_CT">Haplogroup CT</a>\'s common ancestor'],
[70e3,'The first Humans <a href="https://en.wikipedia.org/wiki/Recent_African_origin_of_modern_humans#Southern_Route_dispersal">migrate</a> out of Africa'],
[65e3,'The first humans <a href="https://en.wikipedia.org/wiki/Recent_African_origin_of_modern_humans#South-Asia_and_Australia">migrate</a> to Southeast Asia and Australia'],
[64e3,'Archery Invented'],
[54.7e3,'The first humans <a href="https://en.wikipedia.org/wiki/Recent_African_origin_of_modern_humans#Western_Asia">reach the Levant</a>'],
[52e3,'<a href="https://en.wikipedia.org/wiki/Lonar_Lake">Lonar Impact</a>'],
[50e3,'<a href="https://en.wikipedia.org/wiki/Mousterian_Pluvial">Mousterian Pluvial</a> Begins'],
[49e3,'<a href="https://en.wikipedia.org/wiki/Meteor_Crater">Meteor Crater Impact</a>'],
[44e3,'Cro-Magnon Colonization of Europe'],
[41.4e3,'<a href="https://en.wikipedia.org/wiki/Laschamp_event">Laschamp Event</a>'],
[40e3,'The first humans <a href="https://en.wikipedia.org/wiki/Recent_African_origin_of_modern_humans#East_Asia">migrate</a> to East Asia'],
[40e3,'<a href="https://en.wikipedia.org/wiki/Neanderthal_extinction">Neanderthals go Extinct</a>'],
[30e3,'Mousterian Pluvial Ends'],
[29e3,'Wolf-Dog <a href="https://en.wikipedia.org/wiki/Origin_of_the_domestic_dog#Timespan">common ancestor</a>'],
[28.5e3,'Settlement of New Guinea'],
[27e3,'Age of <a href="https://en.wikipedia.org/wiki/Haplogroup_R_(Y-DNA)">Haplogroup R</a>\'s common ancestor'],
[24e3,'Extinction of the <a href="https://en.wikipedia.org/wiki/Cave_bear">Cave Bear</a>'],
[22.8e3,'Age of <a href="https://en.wikipedia.org/wiki/Haplogroup_R1">Haplogroup R1</a>\'s common ancestor'],
[21.4e3,'<a href="https://en.wikipedia.org/wiki/Tenoumer_crater">Tenoumer Impact</a>'],
[20.4e3,'Age of <a href="https://en.wikipedia.org/wiki/Haplogroup_R1b">Haplogroup R1b</a>\'s common ancestor'],
[14.85e3,'Pigs Domesticated'],
[14.7e3,'<a href="https://en.wikipedia.org/wiki/Bølling-Allerød_warming">Bølling-Allerød Warming</a>'],
[14.6e3,'Beginning of the <a href="https://en.wikipedia.org/wiki/https://en.wikipedia.org/wiki/African_humid_period">African humid period</a>'],
[14.5e3,'<a href="https://en.wikipedia.org/wiki/Bonneville_flood">Bonneville Flood</a>'],
[14.4e3,'<a href="https://en.wikipedia.org/wiki/Bølling_oscillation">Bølling_oscillation</a>'],
[13.9e3,'<a href="https://en.wikipedia.org/wiki/Allerød_oscillation">Allerød_oscillation</a>'],
[13e3,'<a href="https://en.wikipedia.org/wiki/Settlement_of_the_Americas">Settlement of the Americas</a>'],
[13e3,'Extinction of the <a href="https://en.wikipedia.org/wiki/Saber-toothed_cat">Sabertooth</a>'],
[12.9e3,'<a href="https://en.wikipedia.org/wiki/Younger_Dryas">Younger Dryas</a>'],
[12e3,'Goats and Sheep Domesticated'],
[11.7e3,'<a href="https://en.wikipedia.org/wiki/Last_glacial_period">Last Glacial Period</a> Ends'],
[11.1e3,'<a href="https://en.wikipedia.org/wiki/Bond_event">11.1 Kiloyear Event</a>'],
[10.5e3,'Cattle Domesticated'],
[10.3e3,'<a href="https://en.wikipedia.org/wiki/Bond_event">10.3 Kiloyear Event</a>'],
[10.3e3,'End of the <a href="https://en.wikipedia.org/wiki/Baltic_Ice_Lake">Baltic Ice Lake</a>'],
[10e3,'Extinction of <i><a href="https://en.wikipedia.org/wiki/Megatherium">Megatherium</a></i>'],
[9.4e3,'<a href="https://en.wikipedia.org/wiki/Bond_event">9.4 Kiloyear Event</a>'],
[9.1e3,'Formation of <a href="https://en.wikipedia.org/wiki/Lake_Ptolemy">Lake Ptolemy</a>'],
[8.215e3,'<a href="https://en.wikipedia.org/wiki/Storegga_Slide">Storregga Slide</a>'],
[8.2e3,'<a href="https://en.wikipedia.org/wiki/8.2_kiloyear_event">8.2 Kiloyear Event</a>'],
[8e3,'End of <a href="Ancylus Lake">Ancylus Lake</a>'],
[7.7e3,'Extinction of the <a href="https://en.wikipedia.org/wiki/Irish_elk">Irish Elk</a>'],
[7.6e3,'<a href="https://en.wikipedia.org/wiki/Black_Sea_deluge_hypothesis">Black Sea Deluge</a>'],
[7.3e3,'<a href="https://en.wikipedia.org/wiki/Macha_crater">Macha Impact</a>'],
// Above events should be forever static
[currentyear+5000,'<a href="https://en.wikipedia.org/wiki/Chalcolithic">Copper</a>'],
[currentyear+4500,'Dawn of <a href="https://en.wikipedia.org/wiki/Sumer">Sumer</a>'],
[currentyear+4200,'Draining of <a href="https://en.wikipedia.org/wiki/Lake_Agassiz">Lake Agassiz</a>'],
[currentyear+3900,'<a href="https://en.wikipedia.org/wiki/5.9_kiloyear_event">5.9 Kiloyear Event</a>'],
[currentyear+3600,'<a href="https://en.wikipedia.org/wiki/Osceola_Mudflow">Osceola Mudflow</a>'],
[currentyear+3500,'Approximate age of <a href="https://en.wikipedia.org/wiki/Proto-Indo-European_language">Proto-Indo-European</a>'],
[currentyear+3400,'<a href="https://en.wikipedia.org/wiki/Boxhole_crater">Boxhole Impact</a>'],
[currentyear+3300,'<a href="https://en.wikipedia.org/wiki/Bronze_Age">Bronze</a>'],
[currentyear+3300,'Death of <a href="https://en.wikipedia.org/wiki/Ötzi">Ötzi</a>'],
[currentyear+3200,'<a href="https://en.wikipedia.org/wiki/Kushim_(individual)">Kushim</a>, oldest individual with a known name'],
[currentyear+3200,'<a href="https://en.wikipedia.org/wiki/Piora_Oscillation">Piora Oscillation</a>'],
[currentyear+3100,'Reign of <a href="https://en.wikipedia.org/wiki/Narmer">Narmer</a>, earliest known Egyptian pharaoh'],
[currentyear+3000,'<a href="https://en.wikipedia.org/wiki/Morasko_Meteorite_Nature_Reserve">Morasko Impact</a>'],
[currentyear+2700,'<a href="https://en.wikipedia.org/wiki/Henbury_Meteorites_Conservation_Reserve">Henbury Impact</a>'],
[currentyear+2560,'<a href="https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza">Great Pyramid of Giza</a> finished'],
[currentyear+2450,'<a href="https://en.wikipedia.org/wiki/Campo_del_Cielo">Campo del Cielo Impact</a>'],
[currentyear+2200,'<a href="https://en.wikipedia.org/wiki/4.2_kiloyear_event">4.2 Kiloyear Event</a>'],
[currentyear+1650,'Extinction of the <a href="https://en.wikipedia.org/wiki/Woolly_mammoth">Woolly Mammoth</a>'],
[currentyear+1490,'<a href="https://en.wikipedia.org/wiki/Kaali_crater">Kaali Impact</a>'],
[currentyear+1312,'<a href="https://en.wikipedia.org/wiki/Mursili\'s_eclipse">Mursili\'s Eclipse</a>'],
[currentyear+1190,'<a href="https://en.wikipedia.org/wiki/Iron_Age">Iron</a>'],
[currentyear+1175,'<a href="https://en.wikipedia.org/wiki/Late_Bronze_Age_collapse">Late Bronze Age Collapse</a>'],
// Individual days do not matter before 1680 BCE (ty calculus)
[currentyear+753,'<a href="https://en.wikipedia.org/wiki/Ab_urbe_condita">Founding of Rome</a>'],
[currentyear+400,'End of <a href="https://en.wikipedia.org/wiki/Lake_Ptolemy">Lake Ptolemy</a>'],
[currentyear+323,'Death of <a href="https://en.wikipedia.org/wiki/Alexander_the_Great">Alexander the Great</a>'],
[currentyear+264,'<a href="https://en.wikipedia.org/wiki/First_Punic_War">First Punic War</a>'],
[currentyear+218,'Hannibal <a href="https://en.wikipedia.org/wiki/Hannibal\'s_crossing_of_the_Alps">Crosses the Alps</a> during the <a href="https://en.wikipedia.org/wiki/Second_Punic_War">Second Punic War</a>'],
[currentyear+44,'<a href="https://en.wikipedia.org/wiki/Assassination_of_Julius_Caesar">Assassination of Julius Caesar</a>'],
[currentyear-9,'<a href="https://en.wikipedia.org/wiki/Battle_of_the_Teutoburg_Forest">Battle of Teutoburg Forest</a>'],
[currentyear-30,'<a href="https://en.wikipedia.org/wiki/Crucifixion_of_Jesus">Crucifixion of Jesus</a>'],
[currentyear-64,'The <a href="https://en.wikipedia.org/wiki/Great_Fire_of_Rome">Great Fire of Rome</a>'],
[currentyear-122,'The <a href="https://en.wikipedia.org/wiki/Hadrian\'s_Wall">Hadrian\'s Wall</a> begins construction'],
[currentyear-180,'The <a href="https://en.wikipedia.org/wiki/Etruscan_language">Etruscan Language</a> dies'],
[currentyear-235,'The <a href="https://en.wikipedia.org/wiki/Crisis_of_the_Third_Century">Crisis of the Third Century</a> begins'],
[currentyear-325,'The <a href="https://en.wikipedia.org/wiki/First_Council_of_Nicaea">First Council of Nicaea</a>'],
[currentyear-381,'The <a href="https://en.wikipedia.org/wiki/First_Council_of_Constantinople">First Council of Constantinople</a>'],
[currentyear-476,'<a href="https://en.wikipedia.org/wiki/Fall_of_the_Western_Roman_Empire">Fall of West Rome</a>; Dawn of the <a href="https://en.wikipedia.org/wiki/Middle_Ages">Middle Ages</a>'],
[currentyear-565,'Reign of <a href="https://en.wikipedia.org/wiki/Justinian_I">Justinian</a>'],
[currentyear-622,'<a href="https://en.wikipedia.org/wiki/Early_Muslim_conquests">Early Muslim Conquests</a>'],
[currentyear-814,'Reign of <a href="https://en.wikipedia.org/wiki/Charlemagne">Charlemagne</a>'],
[currentyear-1066,'<a href="https://en.wikipedia.org/wiki/Battle_of_Hastings">Battle of Hastings</a>'],
[currentyear-1096,'<a href="https://en.wikipedia.org/wiki/First_Crusade">First Crusade</a>'],
[currentyear-1349,'<a href="https://en.wikipedia.org/wiki/Black_Death">Black Death</a>'], // peak
[currentyear-1387,'Publication of <i><a href="https://en.wikipedia.org/wiki/The_Canterbury_Tales">The Canterbury Tales</a></i>'],
[currentyear-1453,'Fall of <a href="https://en.wikipedia.org/wiki/Byzantine_Empire">Byzantium</a>'],
[currentyear-1492,'Columbus lands on the Americas'],
[currentyear-1532,'Publication of <i><a href="https://en.wikipedia.org/wiki/The_Prince">The Prince</a></i>'],
[currentyear-1599,'Publication of <i><a href="https://en.wikipedia.org/wiki/Hamlet">Hamlet</a></i>'],
[currentyear-1610,'Discovery of the <a href="https://en.wikipedia.org/wiki/Galilean_moons">Galilean Moons</a>'],
[currentyear-1655,'Discovery of <a href="https://en.wikipedia.org/wiki/Titan_(moon)">Titan</a>'],
[currentyear-1687,'Publication of <i><a href="https://en.wikipedia.org/wiki/Philosophiæ_Naturalis_Principia_Mathematica">Principia</a></i>'],
[currentyear-1705,'<a href="https://en.wikipedia.org/wiki/Halley\'s_Comet">Halley\'s Comet</a> recognized as periodic'],
[currentyear-1715,'Beginning of the <a href="https://en.wikipedia.org/wiki/Age_of_Enlightenment">Age of Enlightenment</a>'],
[currentyear-1776-7/12-4/365,'Formation of the United States'],
[currentyear-1781-3/12-13/365,'<a href="https://en.wikipedia.org/wiki/Uranus">Uranus</a> discovered'],
// include months and days aft. 1800
[currentyear-1801,'<a href="https://en.wikipedia.org/wiki/Ceres_(dwarf_planet)">Ceres</a> discovered'], // 1 jan
[currentyear-1803-7/12-4/365,'<a href="https://en.wikipedia.org/wiki/Louisiana_Purchase">Louisiana Purchase</a>'],
[currentyear-1812-6/12-18/365,'Beginning of the <a href="https://en.wikipedia.org/wiki/War_of_1812">War of 1812</a>'],
[currentyear-1846-4/12-25/365,'Beginning of the <a href="https://en.wikipedia.org/wiki/Mexican–American_War">Mexican-American War</a>'],
[currentyear-1846-9/12-23/365,'<a href="https://en.wikipedia.org/wiki/Neptune">Neptune</a> discovered'],
[currentyear-1861-4/12-12/365,'Beginning of the <a href="https://en.wikipedia.org/wiki/American_Civil_War">American Civil War</a>'],
[currentyear-1898-4/12-21/365,'Beginning of the <a href="https://en.wikipedia.org/wiki/Spanish–American_War">Spanish-American War</a>'],
// Pushing back epoch precision to 1900
[diff(-2084140800),'First Powered Heavier-than-Air Flight'],
[diff(-1940976000),'<a href="https://en.wikipedia.org/wiki/Tunguska_event">Tunguska Event</a>'],
[diff(-1749254400),'Beginning of the Great War'],
[diff(-1613865600),'End of the Great War'],
[diff(-1258156800),'<a href="https://en.wikipedia.org/wiki/Pluto">Pluto</a> discovered'],
[diff(-957312000),'Beginning of the Second World War'],
[diff(-767836800),'End of the Second World War'],
[diff(-616032000),'Beginning of the Korean War'],
[diff(-447120000),'Beginning of the Vietnam War'],
[diff(-386310686),'<a href="https://en.wikipedia.org/wiki/Sputnik_1">Sputnik</a> launched'],
[diff(-275248380),'<a href="https://en.wikipedia.org/wiki/Vostok_1">Vostok 1</a> launched'],
[diff(-14182916),'<a href="https://en.wikipedia.org/wiki/Apollo_11">Apollo 11</a> lands on the Moon'],
// Precise number of days for events before 1970 unnecessary.
[diff(8709180),'<a href="https://en.wikipedia.org/wiki/Apollo_13">Apollo 13</a> launched'],
[diff(93221677),'<a href="https://en.wikipedia.org/wiki/Apollo_17">Apollo 17</a> leaves the Moon'],
[diff(293414400),'<a href="https://en.wikipedia.org/wiki/Jimmy_Carter_rabbit_incident">Jimmy Carter Rabbit Incident</a>'],
[diff(495432000),'<a href="https://en.wikipedia.org/wiki/Super_Mario_Bros.">Super Mario Bros.</a> Released'],
[diff(682056000),'<a href="https://en.wikipedia.org/wiki/Super_Mario_World">Super Mario World</a> Released in NA'],
[diff(725846400),'<a href="https://en.wikipedia.org/wiki/Dissolution_of_Czechoslovakia">Velvet Divorce</a>'],
[diff(973627200),'<a href="https://en.wikipedia.org/wiki/United_States_presidential_election,_2000">Election Night 2000</a>'],
[diff(1000212360),'<a href="https://en.wikipedia.org/wiki/September_11_attacks">September 11 Attacks</a>'],
[diff(1000771200),'<a href="https://en.wikipedia.org/wiki/2001_anthrax_attacks">2001 Anthrax Attacks</a>'],
[diff(1059710400),'<a href="https://en.wikipedia.org/wiki/Myspace">Myspace</a> Launched'],
[diff(1075870800),'<a href="https://en.wikipedia.org/wiki/Facebook">Facebook</a> Launched'],
[diff(1108357200),'<a href="https://en.wikipedia.org/wiki/YouTube">YouTube</a> Launched'],
[diff(1154390400),'<a href="https://en.wikipedia.org/wiki/Pluto">Pluto</a> no longer considered a planet'],
[diff(1242532800),'<a href="https://en.wikipedia.org/wiki/Minecraft">Minecraft Classic</a> Released'],
[diff(1305172800),'<a href="https://en.wikipedia.org/wiki/Death_of_Osama_bin_Laden">Death of Osama bin Laden</a>'],
[diff(1307332800),'<a href="https://en.wikipedia.org/wiki/Twitch.tv">Twitch</a> Launched'],
[diff(1359003600),'<a href="https://en.wikipedia.org/wiki/Vine_(service)">Vine</a> Launched'],
[diff(1478667600),'Donald Trump Elected President of the US'], // roughly when it became certain; 00:00 EST 9 NOV 2016 
[diff(1494907200),'<a href="https://mocha2007.github.io">Mocha\'s Site</a> Launched'],
[diff(1503705600),'<a href="https://en.wikipedia.org/wiki/Hurricane_Harvey">Hurricane Harvey</a> makes landfall in Texas'],
[diff(1508371200),'<abbr title="The first known insterstellar object to enter the solar system"><a href="https://en.wikipedia.org/wiki/ʻOumuamua">ʻOumuamua</a></abbr> discovered'],
[diff(1522687500),'PrimeClock <a href="https://github.com/Mocha2007/mocha2007.github.io/commit/0f4ac911c48e82779748c4629b57ec72503ba45d">launched</a>']
// https://en.wikipedia.org/wiki/Timelines_of_world_history
];

function arraysEqual(arr1,arr2){
	"use strict";
	if (arr1.length !== arr2.length){
		return false;
	}
	for (i=0;i<arr1.length;i+=1){
		if (arr1[i] !== arr2[i]){
			return false;
		}
	}
	return true;
}

function gcd(a,b){
	"use strict";
	if (b===0){
		return a;
	}
	return gcd(b,a%b);
}

function factorize(n){
	"use strict";
	// only works for natual numbers greater than one
	var pf = [];
	var t = 2;
	while (true){
		if (n%t===0){
			if (pf.length && pf[pf.length-1][0]===t){
				pf[pf.length-1][1]+=1;
			}
			else {
				pf.push([t,1]);
			}
			n = n/t;
		}
		else {
			t+=t===2?1:2;
		}
		// check to break early
		if (t*t>n){
			if (pf.length && pf[pf.length-1][0]===n){
				pf[pf.length-1][1]+=1;
			}
			else {
				pf.push([n,1]);
			}
			break;
		}
	}
	return pf;
}

function ispower(factorization){
	"use strict";
	var powertable = factorization.map(function f(x){return x[1];});
	var gggcd = 0;
	for (i=0;i<powertable.length;i+=1){
		if (gggcd){
			gggcd = gcd(gggcd,powertable[i]);
		}
		else {
			gggcd = powertable[i];
		}
		if (gggcd===1){
			return false;
		}
	}
	return arraysEqual(new Array(factorization.length).fill(factorization[0][1]),powertable);
}

function issemiprime(factorization){
	"use strict";
	if (factorization.length === 2 && factorization[0][1]+factorization[1][1] === 2){
		return true;
	}
	if (factorization.length === 1 && factorization[0][1] === 2){
		return true;
	}
	return false;
}

function commaconvert(s){
	"use strict";
	s = s.split('');
	var n = 0;
	for (i=0;i<s.length;i+=1){
		if (s[i]===','){
			if (n%2===0){
				s[i]='^';
			}
			else {
				s[i]=' &times; ';
			}
			n+=1;
		}
	}
	return s.join('');
}
/*
x is seconds since 1 Jan
y is seconds before 2018

ae^-(bx/year) = y

ae^-(bx/year) = 14e9 * year

a = 14e9
*/

function ialc(y){
	"use strict";
	var otherx = timeSinceYear(); // REAL seconds since year beginning
	var x = Math.floor(year*(1-Math.log(y)/Math.log(a))); // FAKE seconds after beginning of year
	var wannadate = new Date(Date.now()-1000*(otherx-x)); // convert FAKE 2 DATE
	return String(wannadate).slice(4,24);
}

function alc(){
	"use strict";
	var x = timeSinceYear(); // seconds since year beginning
	var y = Math.pow(a,1-x/year);
	var str = '';
	for (i=0;i<events.length;i+=1){
		if (debug || events[i][0]>y){
			str+='<br>'+(i===0?'Jan 01 '+currentyear+' 00:00:00':ialc(events[i][0]))+' - '+events[i][1];
		}
		else {
			break;
		}
	}
	document.getElementById("alc").innerHTML = str+'<br><span id="nowtime"></span>';
}

function primeclock(){ // can't use strict mode because of IE
	var sec = Math.floor(new Date()/1000);
	var str = factorize(sec);
	var factorization = commaconvert(String(str)).replace(/\^1/g,'').replace(/\^/g,'<sup>').replace(/\s&times;/g,'</sup> &times;');
	var isprime = factorization.length === String(sec).length;

	var title = document.getElementById("c1");
	title.innerHTML = sec;
	title.classList = [isprime?'prime':(ispower(str)?'ppower':(issemiprime(str)?'semiprime':'composite'))];
	var buffer = '<sup class="invisible">1</sup>'; // necessary to prevent text from jumping up and down; sadly, no css solution possible
	document.getElementById("c2").innerHTML = buffer+factorization+buffer;

	var x = timeSinceYear(); // seconds since year beginning
	var y = Math.pow(a,1-x/year);
	var yprime = Math.round(y*Math.log(a)*24*60*60).toLocaleString();

	document.getElementById("nowtime").innerHTML = (String(new Date()).slice(4,24))+' - Now ('+Math.round(y).toLocaleString()+') Years Ago ('+yprime+'x Speed)';
}