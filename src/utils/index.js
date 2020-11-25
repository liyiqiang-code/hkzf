import axios from 'axios';


export function getCurrentCity() {

    //当前城市信息

    return new Promise((resolve, reject) => {

        const curCityStr = localStorage.getItem('hkzf_55_city');

        let curCity = null;
        if (curCityStr === 'undefined' || curCityStr === null) {
            curCity = {}
        } else {
            curCity = JSON.parse(curCityStr)
        }

        if (curCity.label) {
            resolve(curCity);
            return;
        }

        try {

            var myCity = new window.BMap.LocalCity();

            myCity.get(async (result) => {
                var cityName = result.name;

                const res = await axios.get(`http://localhost:8080/area/info?name=${cityName}`);

                localStorage.setItem('hkzf_55_city', JSON.stringify(res.data.body));
                resolve(res.data.body);
            });
        } catch (e) {
            reject(e);
        }
    })
} 