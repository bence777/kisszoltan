/**
 * KSH Ingatlanadattár — Budapest 2024, NAV-adásvételek alapján.
 * https://www.ksh.hu/s/ingatlanadattar/adattar?ter=01&year=2024
 * Egység: ezer forint / m², darab. Az árak eladási, NEM hirdetési árak.
 * A 2023-as összehasonlító összesített árak:
 * https://www.ksh.hu/s/ingatlanadattar/adattar?ter=01&year=2023
 * Az adatok nem azonosak a 2026-os piaci árszinttel, és nem alkalmasak
 * egyedi / luxus ingatlanok automatikus értékbecslésére.
 */
const rows = [
// id, family price/count, apartment price/count, panel price/count, overall price/count, 2023 overall price
 [1,null,0,1274,448,null,0,1274,448,1212],
 [2,1165,66,1282,1240,null,0,1276,1306,1204],
 [3,1071,63,1150,662,876,1112,982,1837,890],
 [4,832,42,886,718,835,816,858,1576,745],
 [5,null,0,1452,626,null,0,1452,626,1267],
 [6,null,0,1132,1163,null,0,1132,1163,994],
 [7,null,0,1021,1915,null,0,1021,1915,940],
 [8,1384,5,943,1877,872,95,941,1977,842],
 [9,859,5,1053,1355,896,53,1047,1413,931],
 [10,721,29,816,898,772,467,799,1394,725],
 [11,1228,29,1188,1708,988,718,1130,2455,1031],
 [12,1439,12,1247,931,null,0,1250,945,1129],
 [13,1093,27,1114,2236,959,420,1089,2683,985],
 [14,978,88,962,1951,857,547,940,2586,853],
 [15,707,133,813,295,793,749,789,1177,703],
 [16,843,230,905,388,785,37,877,655,822],
 [17,687,285,889,218,792,256,781,759,722],
 [18,672,188,838,513,734,325,775,1026,720],
 [19,650,58,826,358,746,406,774,822,728],
 [20,641,96,739,665,697,100,723,861,647],
 [21,670,97,711,443,707,457,705,997,633],
 [22,872,90,892,302,857,94,882,486,812],
 [23,561,46,676,71,713,25,645,142,547]
];
const areas={1:'Várnegyed',2:'Rózsadomb · Törökvész',3:'Óbuda',4:'Újpest',5:'Belváros',6:'Terézváros',7:'Erzsébetváros',8:'Józsefváros',9:'Ferencváros',10:'Kőbánya',11:'Újbuda',12:'Hegyvidék',13:'Újlipótváros · Angyalföld',14:'Zugló',15:'Rákospalota',16:'Mátyásföld · Sashalom',17:'Rákosmente',18:'Pestszentlőrinc',19:'Kispest',20:'Pesterzsébet',21:'Csepel',22:'Budafok · Tétény',23:'Soroksár'};
export const districtMarket = rows.map(([id,house,houseN,apartment,apartmentN,panel,panelN,total,totalN,previous])=>({
 id,name:areas[id],group:[1,2,3,11,12,22].includes(id)?'Buda':'Pest',
 all:{price:total,count:totalN},house:{price:house,count:houseN},apartment:{price:apartment,count:apartmentN},panel:{price:panel,count:panelN},previous
}));
export const districtSources={
 historical:'https://www.ksh.hu/s/ingatlanadattar/adattar?ter=01&year=2024',
 previous:'https://www.ksh.hu/s/ingatlanadattar/adattar?ter=01&year=2023',
 latest:'https://www.ksh.hu/s/kiadvanyok/lakaspiaci-arak-lakasarindex-2026-i-negyedev/'
};
