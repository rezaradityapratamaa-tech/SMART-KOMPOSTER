/* =========================================================
   SMART KOMPOSTER
   PROFESSIONAL IoT DASHBOARD
   FINAL JAVASCRIPT
   ---------------------------------------------------------
   Sistem:
   ATmega328
        ↓
   Sensor DS18B20 + Moisture + NPK
        ↓
   Ethernet / W5500
        ↓
   ESP32
        ↓
   Dashboard + Aktuator
   ---------------------------------------------------------
   MODE:
   - Simulation
   - Automatic Control
   - Manual Control
   - LocalStorage History
   - ID / EN
   - Light / Dark
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

const state = {

    temperature: 32.5,

    moisture: 65,

    nitrogen: 120,

    phosphorus: 80,

    potassium: 150,

    packets: 1248,

    history: [],

    simulation: true,

    autoMode: false,

    language:
        localStorage.getItem(
            "smartKomposterLanguage"
        ) || "id",

    theme:
        localStorage.getItem(
            "smartKomposterTheme"
        ) || "light",

    ethernet: true,

    atmega: true,

    esp32: true,

    w5500: true,

    devices: {

        em4: false,

        water: false,

        fan: false

    },

    lastUpdate: null

};


/* =========================================================
   HELPER
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function random(min, max) {

    return Math.random() *
        (max - min) + min;

}


function clamp(value, min, max) {

    return Math.min(
        max,
        Math.max(
            min,
            value
        )
    );

}


function round(value, digits = 0) {

    return Number(
        Number(value).toFixed(digits)
    );

}


function getLanguage() {

    return state.language;

}


function t(key) {

    return (
        translations[state.language]?.[key] ||
        translations.id[key] ||
        key
    );

}


/* =========================================================
   TRANSLATION
========================================================= */

const translations = {

    id: {

        dashboard: "Dashboard",

        monitoring:
            "Monitoring Real-Time",

        history:
            "Riwayat Monitoring",

        analytics:
            "Analitik & Statistik",

        control:
            "Kontrol Perangkat",

        transmitter:
            "Transmitter",

        receiver:
            "Receiver",

        system_status:
            "Status Sistem",

        notifications:
            "Notifikasi",

        settings:
            "Pengaturan",

        main_menu:
            "MENU UTAMA",

        system_menu:
            "SISTEM",

        project_label:
            "SMART COMPOSTER",

        project_name:
            "Wadah Pupuk Organik Pintar",

        ethernet_communication:
            "Komunikasi Data Ethernet",

        system_online:
            "Sistem Online",

        ethernet_connected:
            "Ethernet Connected",

        online:
            "ONLINE",

        offline:
            "OFFLINE",

        date:
            "TANGGAL",

        hero_title:
            "Smart Composter - Wadah pupuk organik pintar menggunakan komunikasi data Ethernet",

        hero_description:
            "Sistem monitoring dan kontrol berbasis IoT untuk memantau suhu, kelembapan, Nitrogen, Fosfor dan Kalium secara real-time.",

        microcontroller:
            "MICROCONTROLLER",

        iot_controller:
            "IOT CONTROLLER",

        communication:
            "KOMUNIKASI",

        sensor:
            "SENSOR",

        health:
            "HEALTH",

        system_normal:
            "Sistem Beroperasi Normal",

        sensor_network_active:
            "Sensor & jaringan aktif",

        integrated_monitoring:
            "Monitoring Sensor Terpadu",

        integrated_description:
            "Seluruh hasil pengukuran sensor ditampilkan dalam satu blok agar lebih mudah dipantau.",

        live_sensor:
            "LIVE SENSOR",

        temperature:
            "Suhu",

        moisture:
            "Kelembapan",

        normal_limit:
            "Batas normal",

        communication_data:
            "KOMUNIKASI DATA",

        refresh:
            "Refresh",

        temperature_moisture_chart:
            "Grafik Suhu & Kelembapan",

        npk_chart:
            "Komposisi Nutrisi NPK",

        communication_architecture:
            "Arsitektur Komunikasi Data",

        architecture_description:
            "Aliran data dari transmitter menuju receiver kemudian diteruskan ke dashboard dan aktuator.",

        ethernet_active:
            "ETHERNET ACTIVE",

        sensor_data_source:
            "Sumber data sensor",

        data_transport:
            "Jalur komunikasi",

        connected:
            "Connected",

        disconnected:
            "Disconnected",

        data_processor:
            "Pengolah data & kontrol",

        actuator:
            "Aktuator",

        monitoring_output:
            "Dashboard & analitik",

        actuator_output:
            "Kendali perangkat",

        system_health:
            "Kesehatan Sistem",

        all_components_normal:
            "Semua komponen utama berfungsi normal.",

        recent_activity:
            "Aktivitas Terbaru",

        dashboard_active:
            "Sistem dashboard aktif",

        just_now:
            "Baru saja",

        sensor_received:
            "Data sensor diterima",

        ethernet_stable:
            "Koneksi Ethernet stabil",

        monitoring_description:
            "Pantau seluruh parameter komposter secara langsung.",

        monitoring_trend:
            "Tren Monitoring Sensor",

        history_description:
            "Catatan hasil pembacaan sensor.",

        measurement_data:
            "Data Pengukuran",

        clear_history:
            "Hapus Riwayat",

        time:
            "Waktu",

        status:
            "Status",

        analytics_description:
            "Ringkasan performa dan kualitas pupuk Smart Komposter.",

        average_temperature:
            "RATA-RATA SUHU",

        average_moisture:
            "RATA-RATA KELEMBAPAN",

        data_packet:
            "DATA PACKETS",

        fertilizer_quality:
            "KUALITAS PUPUK",

        quality_excellent:
            "Sangat Baik",

        quality_good:
            "Baik",

        quality_attention:
            "Perlu Perhatian",

        fertilizer_quality_chart:
            "Grafik Kualitas Pupuk",

        fertilizer_quality_description:
            "Indeks kualitas dihitung dari kestabilan suhu, kelembapan dan keseimbangan nutrisi NPK.",

        temperature_stability:
            "Stabilitas Suhu",

        moisture_stability:
            "Kelembapan",

        npk_balance:
            "Keseimbangan NPK",

        control_description:
            "Kontrol perangkat pada sistem Smart Komposter.",

        em4_pump:
            "Pompa EM4",

        em4_description:
            "Mengalirkan larutan EM4 ke dalam komposter.",

        water_pump:
            "Pompa Air",

        water_description:
            "Menjaga kelembapan kompos.",

        fan:
            "Kipas",

        fan_description:
            "Membantu sirkulasi udara komposter.",

        turn_on:
            "Nyalakan",

        turn_off:
            "Matikan",

        automatic_mode:
            "Mode Otomatis",

        automatic_description:
            "Perangkat dikontrol berdasarkan kondisi sensor.",

        transmitter_title:
            "Transmitter",

        transmitter_description:
            "ATmega328 membaca sensor dan mengirimkan data melalui Ethernet.",

        transmitter_role:
            "Akuisisi data sensor lingkungan dan NPK.",

        node_ready:
            "Node siap mengirim data",

        temperature_sensor:
            "Sensor suhu",

        moisture_sensor:
            "Moisture Sensor",

        moisture_sensor_description:
            "Sensor kelembapan",

        npk_sensor_description:
            "Pembacaan nutrisi tanah",

        transmitter_flow:
            "Alur Data Transmitter",

        read_sensor:
            "Baca Sensor",

        process_data:
            "Proses Data",

        send_ethernet:
            "Kirim Ethernet",

        receiver_title:
            "Receiver",

        receiver_description:
            "ESP32 menerima data Ethernet, memproses monitoring dan mengendalikan aktuator.",

        receiver_role:
            "Pengolah data, monitoring dan kontrol aktuator.",

        receiver_ready:
            "Node siap menerima data",

        receiver_monitoring:
            "Data sensor diteruskan ke sistem monitoring dashboard.",

        receiver_actuator:
            "ESP32 mengatur perangkat berdasarkan kondisi sistem.",

        receiver_processing:
            "Proses Data ESP32",

        receive_packet:
            "Terima Packet",

        validate_data:
            "Validasi Data",

        monitoring_control:
            "Monitoring & Kontrol",

        status_description:
            "Kondisi komunikasi dan perangkat.",

        status_all_connected:
            "Semua modul utama terhubung dan siap digunakan.",

        notifications_description:
            "Informasi penting sistem.",

        notification_online:
            "Koneksi Ethernet dan ESP32 aktif.",

        sensor_updated:
            "Data sensor diperbarui",

        notification_sensor:
            "Data suhu, kelembapan dan NPK berhasil diperbarui.",

        simulation_active:
            "Mode simulasi aktif",

        notification_simulation:
            "Nilai sensor menggunakan simulasi lokal.",

        settings_description:
            "Atur preferensi dashboard.",

        appearance:
            "Tampilan",

        appearance_description:
            "Ubah mode terang atau gelap.",

        change_theme:
            "Ubah Tema",

        language:
            "Bahasa",

        language_description:
            "Pilih bahasa dashboard.",

        sensor_simulation:
            "Simulasi Sensor",

        simulation_description:
            "Aktifkan perubahan sensor otomatis.",

        system_status_title:
            "STATUS SISTEM",

        normal:
            "NORMAL",

        check:
            "CHECK",

        warning:
            "PERINGATAN",

        good:
            "BAIK",

        excellent:
            "SANGAT BAIK",

        packet:
            "PACKET",

        automatic_enabled:
            "Mode otomatis aktif",

        automatic_disabled:
            "Mode otomatis nonaktif",

        sensor_simulation_enabled:
            "Simulasi sensor aktif",

        sensor_simulation_disabled:
            "Simulasi sensor nonaktif",

        history_cleared:
            "Riwayat monitoring dihapus",

        device_on:
            "perangkat ON",

        device_off:
            "perangkat OFF"

    },


    en: {

        dashboard:
            "Dashboard",

        monitoring:
            "Real-Time Monitoring",

        history:
            "Monitoring History",

        analytics:
            "Analytics & Statistics",

        control:
            "Device Control",

        transmitter:
            "Transmitter",

        receiver:
            "Receiver",

        system_status:
            "System Status",

        notifications:
            "Notifications",

        settings:
            "Settings",

        main_menu:
            "MAIN MENU",

        system_menu:
            "SYSTEM",

        project_label:
            "SMART COMPOSTER",

        project_name:
            "Smart Organic Fertilizer System",

        ethernet_communication:
            "Ethernet Data Communication",

        system_online:
            "System Online",

        ethernet_connected:
            "Ethernet Connected",

        online:
            "ONLINE",

        offline:
            "OFFLINE",

        date:
            "DATE",

        hero_title:
            "Smart Composter - Smart organic fertilizer container using Ethernet data communication",

        hero_description:
            "IoT-based monitoring and control system for real-time temperature, moisture, Nitrogen, Phosphorus and Potassium monitoring.",

        microcontroller:
            "MICROCONTROLLER",

        iot_controller:
            "IOT CONTROLLER",

        communication:
            "COMMUNICATION",

        sensor:
            "SENSOR",

        health:
            "HEALTH",

        system_normal:
            "System Operating Normally",

        sensor_network_active:
            "Sensors & network active",

        integrated_monitoring:
            "Integrated Sensor Monitoring",

        integrated_description:
            "All sensor measurements are displayed in one integrated section for easier monitoring.",

        live_sensor:
            "LIVE SENSOR",

        temperature:
            "Temperature",

        moisture:
            "Moisture",

        normal_limit:
            "Normal range",

        communication_data:
            "DATA COMMUNICATION",

        refresh:
            "Refresh",

        temperature_moisture_chart:
            "Temperature & Moisture",

        npk_chart:
            "NPK Nutrient Composition",

        communication_architecture:
            "Data Communication Architecture",

        architecture_description:
            "Data flows from the transmitter to the receiver and is then distributed to the dashboard and actuators.",

        ethernet_active:
            "ETHERNET ACTIVE",

        sensor_data_source:
            "Sensor data source",

        data_transport:
            "Communication path",

        connected:
            "Connected",

        disconnected:
            "Disconnected",

        data_processor:
            "Data processor & controller",

        actuator:
            "Actuator",

        monitoring_output:
            "Dashboard & analytics",

        actuator_output:
            "Device control",

        system_health:
            "System Health",

        all_components_normal:
            "All main components are operating normally.",

        recent_activity:
            "Recent Activity",

        dashboard_active:
            "Dashboard system active",

        just_now:
            "Just now",

        sensor_received:
            "Sensor data received",

        ethernet_stable:
            "Ethernet connection stable",

        monitoring_description:
            "Monitor all composting parameters in real time.",

        monitoring_trend:
            "Sensor Monitoring Trend",

        history_description:
            "Sensor measurement records.",

        measurement_data:
            "Measurement Data",

        clear_history:
            "Clear History",

        time:
            "Time",

        status:
            "Status",

        analytics_description:
            "Smart Composter performance and fertilizer quality summary.",

        average_temperature:
            "AVERAGE TEMPERATURE",

        average_moisture:
            "AVERAGE MOISTURE",

        data_packet:
            "DATA PACKETS",

        fertilizer_quality:
            "FERTILIZER QUALITY",

        quality_excellent:
            "Excellent",

        quality_good:
            "Good",

        quality_attention:
            "Needs Attention",

        fertilizer_quality_chart:
            "Fertilizer Quality Trend",

        fertilizer_quality_description:
            "The quality index is calculated from temperature stability, moisture and NPK balance.",

        temperature_stability:
            "Temperature Stability",

        moisture_stability:
            "Moisture",

        npk_balance:
            "NPK Balance",

        control_description:
            "Control devices in the Smart Composter system.",

        em4_pump:
            "EM4 Pump",

        em4_description:
            "Delivers EM4 solution into the composter.",

        water_pump:
            "Water Pump",

        water_description:
            "Maintains compost moisture.",

        fan:
            "Fan",

        fan_description:
            "Supports air circulation inside the composter.",

        turn_on:
            "Turn On",

        turn_off:
            "Turn Off",

        automatic_mode:
            "Automatic Mode",

        automatic_description:
            "Devices are controlled according to sensor conditions.",

        transmitter_title:
            "Transmitter",

        transmitter_description:
            "ATmega328 reads sensor data and transmits it through Ethernet.",

        transmitter_role:
            "Environmental and NPK sensor data acquisition.",

        node_ready:
            "Node ready to transmit data",

        temperature_sensor:
            "Temperature sensor",

        moisture_sensor:
            "Moisture Sensor",

        moisture_sensor_description:
            "Moisture measurement",

        npk_sensor_description:
            "Soil nutrient measurement",

        transmitter_flow:
            "Transmitter Data Flow",

        read_sensor:
            "Read Sensors",

        process_data:
            "Process Data",

        send_ethernet:
            "Send via Ethernet",

        receiver_title:
            "Receiver",

        receiver_description:
            "ESP32 receives Ethernet data, processes monitoring data and controls actuators.",

        receiver_role:
            "Data processing, monitoring and actuator control.",

        receiver_ready:
            "Node ready to receive data",

        receiver_monitoring:
            "Sensor data is forwarded to the dashboard monitoring system.",

        receiver_actuator:
            "ESP32 controls devices according to system conditions.",

        receiver_processing:
            "ESP32 Data Processing",

        receive_packet:
            "Receive Packet",

        validate_data:
            "Validate Data",

        monitoring_control:
            "Monitoring & Control",

        status_description:
            "Communication and device condition.",

        status_all_connected:
            "All main modules are connected and ready.",

        notifications_description:
            "Important system information.",

        notification_online:
            "Ethernet connection and ESP32 are active.",

        sensor_updated:
            "Sensor data updated",

        notification_sensor:
            "Temperature, moisture and NPK data have been updated.",

        simulation_active:
            "Simulation mode active",

        notification_simulation:
            "Sensor values are currently generated locally.",

        settings_description:
            "Configure dashboard preferences.",

        appearance:
            "Appearance",

        appearance_description:
            "Switch between light and dark mode.",

        change_theme:
            "Change Theme",

        language:
            "Language",

        language_description:
            "Select dashboard language.",

        sensor_simulation:
            "Sensor Simulation",

        simulation_description:
            "Enable automatic sensor changes.",

        system_status_title:
            "SYSTEM STATUS",

        normal:
            "NORMAL",

        check:
            "CHECK",

        warning:
            "WARNING",

        good:
            "GOOD",

        excellent:
            "EXCELLENT",

        packet:
            "PACKET",

        automatic_enabled:
            "Automatic mode enabled",

        automatic_disabled:
            "Automatic mode disabled",

        sensor_simulation_enabled:
            "Sensor simulation enabled",

        sensor_simulation_disabled:
            "Sensor simulation disabled",

        history_cleared:
            "Monitoring history cleared",

        device_on:
            "device ON",

        device_off:
            "device OFF"

    }

};


/* =========================================================
   CHART DATA
========================================================= */

const chartData = {

    labels: [],

    temperature: [],

    moisture: [],

    nitrogen: [],

    phosphorus: [],

    potassium: [],

    quality: []

};


/* =========================================================
   CHART REFERENCES
========================================================= */

let sensorChart = null;

let npkChart = null;

let monitorChart = null;

let analyticsChart = null;


/* =========================================================
   CHART COLORS
========================================================= */

const chartColors = {

    green: "#15915d",

    blue: "#438ee8",

    orange: "#ef9d3c",

    purple: "#8b68dc",

    red: "#e45b5b"

};


/* =========================================================
   QUALITY CALCULATION
========================================================= */

function calculateQualityFromValues(
    temp,
    moisture,
    nitrogen,
    phosphorus,
    potassium
) {

    let score = 100;


    /*
     * TEMPERATURE
     * Optimal simulated compost range:
     * 30 - 35 °C
     */

    if (
        temp < 30 ||
        temp > 35
    ) {

        score -= 18;

    } else {

        score -=
            Math.abs(
                32.5 - temp
            ) * 2;

    }


    /*
     * MOISTURE
     */

    if (
        moisture < 50 ||
        moisture > 70
    ) {

        score -= 18;

    } else {

        score -=
            Math.abs(
                60 - moisture
            ) * .35;

    }


    /*
     * NPK
     */

    const nScore =
        100 -
        Math.abs(
            nitrogen - 120
        ) * .35;


    const pScore =
        100 -
        Math.abs(
            phosphorus - 80
        ) * .45;


    const kScore =
        100 -
        Math.abs(
            potassium - 150
        ) * .30;


    const npkScore =
        (
            nScore +
            pScore +
            kScore
        ) / 3;


    score =
        score * .65 +
        npkScore * .35;


    return Math.round(
        clamp(
            score,
            0,
            100
        )
    );

}


function calculateCurrentQuality() {

    return calculateQualityFromValues(

        state.temperature,

        state.moisture,

        state.nitrogen,

        state.phosphorus,

        state.potassium

    );

}


/* =========================================================
   HEALTH CALCULATION
========================================================= */

function calculateHealth() {

    let score = 100;


    if (
        state.temperature < 30 ||
        state.temperature > 35
    ) {

        score -= 12;

    }


    if (
        state.moisture < 50 ||
        state.moisture > 70
    ) {

        score -= 12;

    }


    if (
        state.nitrogen < 80 ||
        state.nitrogen > 170
    ) {

        score -= 5;

    }


    if (
        state.phosphorus < 50 ||
        state.phosphorus > 120
    ) {

        score -= 5;

    }


    if (
        state.potassium < 100 ||
        state.potassium > 190
    ) {

        score -= 5;

    }


    if (!state.ethernet) {

        score -= 20;

    }


    if (!state.atmega) {

        score -= 10;

    }


    if (!state.esp32) {

        score -= 10;

    }


    return Math.round(
        clamp(
            score,
            0,
            100
        )
    );

}


/* =========================================================
   INITIAL CHART DATA
========================================================= */

function createInitialData() {

    chartData.labels = [];

    chartData.temperature = [];

    chartData.moisture = [];

    chartData.nitrogen = [];

    chartData.phosphorus = [];

    chartData.potassium = [];

    chartData.quality = [];


    let temp =
        state.temperature;

    let moist =
        state.moisture;

    let n =
        state.nitrogen;

    let p =
        state.phosphorus;

    let k =
        state.potassium;


    const current =
        new Date();


    for (
        let i = 11;
        i >= 0;
        i--
    ) {

        temp += random(-0.35, 0.35);

        moist += random(-1.2, 1.2);

        n += random(-3, 3);

        p += random(-2, 2);

        k += random(-3, 3);


        temp =
            clamp(
                temp,
                30,
                35
            );


        moist =
            clamp(
                moist,
                50,
                70
            );


        n =
            clamp(
                n,
                95,
                150
            );


        p =
            clamp(
                p,
                60,
                100
            );


        k =
            clamp(
                k,
                120,
                180
            );


        const time =
            new Date(
                current.getTime() -
                i * 3 * 60 * 1000
            );


        chartData.labels.push(

            time.toLocaleTimeString(
                "id-ID",
                {

                    hour:
                        "2-digit",

                    minute:
                        "2-digit"

                }

            )

        );


        chartData.temperature.push(
            round(temp, 1)
        );


        chartData.moisture.push(
            round(moist, 0)
        );


        chartData.nitrogen.push(
            round(n, 0)
        );


        chartData.phosphorus.push(
            round(p, 0)
        );


        chartData.potassium.push(
            round(k, 0)
        );


        chartData.quality.push(

            calculateQualityFromValues(
                temp,
                moist,
                n,
                p,
                k
            )

        );

    }

}


/* =========================================================
   VALUE LABEL PLUGIN
========================================================= */

const valueLabelsPlugin = {

    id: "valueLabels",

    afterDatasetsDraw(chart) {

        if (
            chart.canvas.id ===
            "npkChart" ||

            chart.canvas.id ===
            "analyticsChart"
        ) {

            return;

        }


        const ctx =
            chart.ctx;


        ctx.save();


        chart.data.datasets.forEach(
            (
                dataset,
                datasetIndex
            ) => {

                const meta =
                    chart.getDatasetMeta(
                        datasetIndex
                    );


                if (
                    meta.hidden
                ) {

                    return;

                }


                meta.data.forEach(
                    (
                        point,
                        index
                    ) => {

                        const value =
                            dataset.data[index];


                        if (
                            value === undefined ||
                            value === null
                        ) {

                            return;

                        }


                        const position =
                            point.tooltipPosition();


                        ctx.font =
                            "600 10px Arial";


                        ctx.textAlign =
                            "center";


                        ctx.textBaseline =
                            "bottom";


                        ctx.fillStyle =
                            getComputedStyle(
                                document.body
                            )
                            .getPropertyValue(
                                "--text"
                            );


                        let text =
                            String(value);


                        if (
                            dataset.label ===
                            "Suhu"
                        ) {

                            text +=
                                "°C";

                        }


                        if (
                            dataset.label ===
                            "Kelembapan"
                        ) {

                            text +=
                                "%";

                        }


                        ctx.fillText(
                            text,
                            position.x,
                            position.y - 9
                        );

                    }

                );

            }

        );


        ctx.restore();

    }

};


if (
    typeof Chart !==
    "undefined"
) {

    Chart.register(
        valueLabelsPlugin
    );

}


/* =========================================================
   COMMON CHART OPTIONS
========================================================= */

function commonOptions() {

    const dark =
        document.body.classList.contains(
            "dark"
        );


    const textColor =
        getComputedStyle(
            document.body
        )
        .getPropertyValue(
            "--text"
        )
        .trim();


    const mutedColor =
        getComputedStyle(
            document.body
        )
        .getPropertyValue(
            "--muted"
        )
        .trim();


    return {

        responsive: true,

        maintainAspectRatio: false,

        animation: {

            duration: 350

        },

        interaction: {

            mode: "index",

            intersect: false

        },

        plugins: {

            legend: {

                display: false

            },

            tooltip: {

                backgroundColor:
                    dark
                        ? "#17251e"
                        : "#10251a",

                titleColor:
                    "#ffffff",

                bodyColor:
                    "#ffffff",

                padding: 12,

                cornerRadius: 10,

                displayColors:
                    true

            }

        },

        scales: {

            x: {

                border: {

                    display:
                        false

                },

                grid: {

                    color:
                        dark
                            ? "rgba(255,255,255,.05)"
                            : "rgba(0,0,0,.045)"

                },

                ticks: {

                    color:
                        mutedColor,

                    maxRotation:
                        0,

                    font: {

                        size:
                            10

                    }

                }

            },

            y: {

                border: {

                    display:
                        false

                },

                grid: {

                    color:
                        dark
                            ? "rgba(255,255,255,.05)"
                            : "rgba(0,0,0,.045)"

                },

                ticks: {

                    color:
                        mutedColor,

                    font: {

                        size:
                            10

                    }

                }

            }

        }

    };

}


/* =========================================================
   CANVAS VISIBILITY
========================================================= */

function canvasIsVisible(canvas) {

    if (!canvas) {

        return false;

    }


    const rect =
        canvas.getBoundingClientRect();


    const style =
        getComputedStyle(canvas);


    return (

        rect.width > 0 &&

        rect.height > 0 &&

        style.display !==
            "none" &&

        style.visibility !==
            "hidden"

    );

}


/* =========================================================
   DESTROY CHART
========================================================= */

function destroyChart(chart) {

    if (chart) {

        try {

            chart.destroy();

        } catch (error) {

            console.warn(
                "Chart destroy error:",
                error
            );

        }

    }

    return null;

}


/* =========================================================
   SENSOR CHART
========================================================= */

function createSensorChart() {

    const canvas =
        $("sensorChart");


    if (
        !canvas ||
        !canvasIsVisible(canvas) ||
        typeof Chart ===
            "undefined"
    ) {

        return;

    }


    sensorChart =
        destroyChart(
            sensorChart
        );


    const options =
        commonOptions();


    /*
     * Dual axis
     * Suhu: 25 - 40
     * Kelembapan: 40 - 80
     */

    options.scales = {

        x: {

            border: {
                display: false
            },

            grid: {
                color:
                    "rgba(120,140,130,.08)"
            },

            ticks: {

                color:
                    getComputedStyle(
                        document.body
                    )
                    .getPropertyValue(
                        "--muted"
                    ),

                maxRotation: 0

            }

        },

        y: {

            position: "left",

            min: 25,

            max: 40,

            border: {
                display: false
            },

            grid: {

                color:
                    "rgba(120,140,130,.10)"

            },

            ticks: {

                color:
                    chartColors.green,

                callback(value) {

                    return value + "°C";

                }

            }

        },

        y1: {

            position: "right",

            min: 40,

            max: 80,

            border: {
                display: false
            },

            grid: {
                drawOnChartArea: false
            },

            ticks: {

                color:
                    chartColors.blue,

                callback(value) {

                    return value + "%";

                }

            }

        }

    };


    sensorChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels:
                        [...chartData.labels],

                    datasets: [

                        {

                            label:
                                "Suhu",

                            data:
                                [...chartData.temperature],

                            borderColor:
                                chartColors.green,

                            backgroundColor:
                                "rgba(21,145,93,.10)",

                            borderWidth:
                                2.5,

                            tension:
                                .35,

                            pointRadius:
                                3,

                            pointHoverRadius:
                                5,

                            pointBackgroundColor:
                                chartColors.green,

                            fill:
                                false,

                            yAxisID:
                                "y"

                        },

                        {

                            label:
                                "Kelembapan",

                            data:
                                [...chartData.moisture],

                            borderColor:
                                chartColors.blue,

                            backgroundColor:
                                "rgba(67,142,232,.10)",

                            borderWidth:
                                2.5,

                            tension:
                                .35,

                            pointRadius:
                                3,

                            pointHoverRadius:
                                5,

                            pointBackgroundColor:
                                chartColors.blue,

                            fill:
                                false,

                            yAxisID:
                                "y1"

                        }

                    ]

                },

                options

            }

        );

}


/* =========================================================
   NPK CHART
========================================================= */

function createNpkChart() {

    const canvas =
        $("npkChart");


    if (
        !canvas ||
        !canvasIsVisible(canvas) ||
        typeof Chart ===
            "undefined"
    ) {

        return;

    }


    npkChart =
        destroyChart(
            npkChart
        );


    const labels =
        chartData.labels.slice(-8);


    const n =
        chartData.nitrogen.slice(-8);


    const p =
        chartData.phosphorus.slice(-8);


    const k =
        chartData.potassium.slice(-8);


    const options =
        commonOptions();


    options.scales.y = {

        beginAtZero:
            true,

        suggestedMax:
            200,

        border: {

            display:
                false

        },

        grid: {

            color:
                "rgba(120,140,130,.10)"

        },

        ticks: {

            color:
                getComputedStyle(
                    document.body
                )
                .getPropertyValue(
                    "--muted"
                ),

            callback(value) {

                return (
                    value +
                    " mg/kg"
                );

            }

        }

    };


    options.plugins.tooltip.callbacks = {

        label(context) {

            return (

                `${context.dataset.label}: ` +
                `${context.raw} mg/kg`

            );

        }

    };


    npkChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Nitrogen",

                            data:
                                n,

                            backgroundColor:
                                "rgba(21,145,93,.78)",

                            borderRadius:
                                6,

                            borderSkipped:
                                false,

                            barPercentage:
                                .72,

                            categoryPercentage:
                                .65

                        },

                        {

                            label:
                                "Fosfor",

                            data:
                                p,

                            backgroundColor:
                                "rgba(239,157,60,.78)",

                            borderRadius:
                                6,

                            borderSkipped:
                                false,

                            barPercentage:
                                .72,

                            categoryPercentage:
                                .65

                        },

                        {

                            label:
                                "Kalium",

                            data:
                                k,

                            backgroundColor:
                                "rgba(139,104,220,.78)",

                            borderRadius:
                                6,

                            borderSkipped:
                                false,

                            barPercentage:
                                .72,

                            categoryPercentage:
                                .65

                        }

                    ]

                },

                options

            }

        );

}


/* =========================================================
   MONITOR CHART
========================================================= */

function createMonitorChart() {

    const canvas =
        $("monitorChart");


    if (
        !canvas ||
        !canvasIsVisible(canvas) ||
        typeof Chart ===
            "undefined"
    ) {

        return;

    }


    monitorChart =
        destroyChart(
            monitorChart
        );


    const options =
        commonOptions();


    options.scales.y = {

        min: 25,

        max: 80,

        border: {

            display:
                false

        },

        grid: {

            color:
                "rgba(120,140,130,.10)"

        },

        ticks: {

            color:
                getComputedStyle(
                    document.body
                )
                .getPropertyValue(
                    "--muted"
                )

        }

    };


    monitorChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels:
                        [...chartData.labels],

                    datasets: [

                        {

                            label:
                                "Suhu",

                            data:
                                [...chartData.temperature],

                            borderColor:
                                chartColors.green,

                            borderWidth:
                                2.5,

                            tension:
                                .35,

                            pointRadius:
                                3,

                            pointBackgroundColor:
                                chartColors.green

                        },

                        {

                            label:
                                "Kelembapan",

                            data:
                                [...chartData.moisture],

                            borderColor:
                                chartColors.blue,

                            borderWidth:
                                2.5,

                            tension:
                                .35,

                            pointRadius:
                                3,

                            pointBackgroundColor:
                                chartColors.blue

                        }

                    ]

                },

                options

            }

        );

}


/* =========================================================
   ANALYTICS CHART
========================================================= */

function createAnalyticsChart() {

    const canvas =
        $("analyticsChart");


    if (
        !canvas ||
        !canvasIsVisible(canvas) ||
        typeof Chart ===
            "undefined"
    ) {

        return;

    }


    analyticsChart =
        destroyChart(
            analyticsChart
        );


    const options =
        commonOptions();


    options.scales.y = {

        min: 0,

        max: 100,

        border: {

            display:
                false

        },

        grid: {

            color:
                "rgba(120,140,130,.10)"

        },

        ticks: {

            stepSize:
                20,

            callback(value) {

                return value + "%";

            },

            color:
                getComputedStyle(
                    document.body
                )
                .getPropertyValue(
                    "--muted"
                )

        }

    };


    options.plugins.tooltip.callbacks = {

        label(context) {

            return (
                `Quality Index: ${context.raw}%`
            );

        }

    };


    analyticsChart =
        new Chart(
            canvas,
            {

                type: "line",

                data: {

                    labels:
                        [...chartData.labels],

                    datasets: [

                        {

                            label:
                                "Fertilizer Quality",

                            data:
                                [...chartData.quality],

                            borderColor:
                                chartColors.purple,

                            backgroundColor:
                                "rgba(139,104,220,.12)",

                            borderWidth:
                                3,

                            tension:
                                .38,

                            pointRadius:
                                3,

                            pointHoverRadius:
                                6,

                            pointBackgroundColor:
                                chartColors.purple,

                            fill:
                                true

                        }

                    ]

                },

                options

            }

        );

}


/* =========================================================
   CREATE ALL CHARTS
========================================================= */

function createAllCharts() {

    if (
        typeof Chart ===
            "undefined"
    ) {

        console.error(
            "Chart.js belum tersedia."
        );

        return;

    }


    requestAnimationFrame(
        () => {

            createSensorChart();

            createNpkChart();

            createMonitorChart();

            createAnalyticsChart();

        }
    );

}


/* =========================================================
   RESIZE CHARTS
========================================================= */

function resizeAllCharts() {

    [

        sensorChart,

        npkChart,

        monitorChart,

        analyticsChart

    ].forEach(chart => {

        if (chart) {

            try {

                chart.resize();

            } catch (error) {

                console.warn(
                    "Chart resize error:",
                    error
                );

            }

        }

    });

}


/* =========================================================
   REFRESH CHART DATA
========================================================= */

function refreshChartData() {

    if (sensorChart) {

        sensorChart.data.labels =
            [...chartData.labels];

        sensorChart.data.datasets[0].data =
            [...chartData.temperature];

        sensorChart.data.datasets[1].data =
            [...chartData.moisture];

        sensorChart.update("none");

    }


    if (npkChart) {

        npkChart.data.labels =
            chartData.labels.slice(-8);

        npkChart.data.datasets[0].data =
            chartData.nitrogen.slice(-8);

        npkChart.data.datasets[1].data =
            chartData.phosphorus.slice(-8);

        npkChart.data.datasets[2].data =
            chartData.potassium.slice(-8);

        npkChart.update("none");

    }


    if (monitorChart) {

        monitorChart.data.labels =
            [...chartData.labels];

        monitorChart.data.datasets[0].data =
            [...chartData.temperature];

        monitorChart.data.datasets[1].data =
            [...chartData.moisture];

        monitorChart.update("none");

    }


    if (analyticsChart) {

        analyticsChart.data.labels =
            [...chartData.labels];

        analyticsChart.data.datasets[0].data =
            [...chartData.quality];

        analyticsChart.update("none");

    }

}


/* =========================================================
   UPDATE CHART DATA
========================================================= */

function updateChartData() {

    const now =
        new Date();


    chartData.labels.push(

        now.toLocaleTimeString(
            "id-ID",
            {

                hour:
                    "2-digit",

                minute:
                    "2-digit"

            }

        )

    );


    chartData.temperature.push(
        round(
            state.temperature,
            1
        )
    );


    chartData.moisture.push(
        round(
            state.moisture,
            0
        )
    );


    chartData.nitrogen.push(
        round(
            state.nitrogen,
            0
        )
    );


    chartData.phosphorus.push(
        round(
            state.phosphorus,
            0
        )
    );


    chartData.potassium.push(
        round(
            state.potassium,
            0
        )
    );


    chartData.quality.push(
        calculateCurrentQuality()
    );


    const maxPoints =
        20;


    while (
        chartData.labels.length >
        maxPoints
    ) {

        chartData.labels.shift();

        chartData.temperature.shift();

        chartData.moisture.shift();

        chartData.nitrogen.shift();

        chartData.phosphorus.shift();

        chartData.potassium.shift();

        chartData.quality.shift();

    }


    refreshChartData();

}


/* =========================================================
   SENSOR STATUS
========================================================= */

function isTemperatureNormal() {

    return (

        state.temperature >= 30 &&
        state.temperature <= 35

    );

}


function isMoistureNormal() {

    return (

        state.moisture >= 50 &&
        state.moisture <= 70

    );

}


function getNpkStatus(value, idealMin, idealMax) {

    if (
        value >= idealMin &&
        value <= idealMax
    ) {

        return "NORMAL";

    }


    return "CHECK";

}


/* =========================================================
   UPDATE SENSOR UI
========================================================= */

function updateSensorUI() {

    /*
     * TEMPERATURE
     */

    if ($("temperature")) {

        $("temperature").innerHTML =

            state.temperature.toFixed(1) +
            "<span>°C</span>";

    }


    /*
     * MOISTURE
     */

    if ($("moisture")) {

        $("moisture").innerHTML =

            state.moisture.toFixed(0) +
            "<span>%</span>";

    }


    /*
     * NPK
     */

    if ($("nitrogen")) {

        $("nitrogen").textContent =
            Math.round(
                state.nitrogen
            );

    }


    if ($("phosphorus")) {

        $("phosphorus").textContent =
            Math.round(
                state.phosphorus
            );

    }


    if ($("potassium")) {

        $("potassium").textContent =
            Math.round(
                state.potassium
            );

    }


    /*
     * PACKETS
     */

    if ($("packets")) {

        $("packets").textContent =
            state.packets.toLocaleString(
                "en-US"
            );

    }


    /*
     * STATUS
     */

    const tempNormal =
        isTemperatureNormal();


    const moistureNormal =
        isMoistureNormal();


    updateStatusElement(
        $("tempStatus"),
        tempNormal
    );


    updateStatusElement(
        $("moistureStatus"),
        moistureNormal
    );


    /*
     * BAR
     */

    if ($("temperatureBar")) {

        $("temperatureBar")
            .style.width =

            clamp(

                (
                    (
                        state.temperature -
                        25
                    ) /
                    15
                ) * 100,

                0,

                100

            ) + "%";

    }


    if ($("moistureBar")) {

        $("moistureBar")
            .style.width =

            clamp(
                state.moisture,
                0,
                100
            ) + "%";

    }


    /*
     * MONITORING PAGE
     */

    setText(
        "monitorTemperature",
        state.temperature.toFixed(1) + "°C"
    );


    setText(
        "monitorMoisture",
        state.moisture.toFixed(0) + "%"
    );


    setText(
        "monitorN",
        Math.round(
            state.nitrogen
        )
    );


    setText(
        "monitorP",
        Math.round(
            state.phosphorus
        )
    );


    setText(
        "monitorK",
        Math.round(
            state.potassium
        )
    );


    setText(
        "monitorTempStatus",
        tempNormal
            ? t("normal")
            : t("check")
    );


    setText(
        "monitorMoistStatus",
        moistureNormal
            ? t("normal")
            : t("check")
    );


    /*
     * HEALTH
     */

    const health =
        calculateHealth();


    setText(
        "health",
        health + "%"
    );


    setText(
        "dashboardHealthScore",
        health
    );


    setText(
        "statusHealth",
        health + "%"
    );


    updateQualityUI();

    updateSystemStatusUI();

}


/* =========================================================
   GENERIC TEXT SETTER
========================================================= */

function setText(id, value) {

    const element =
        $(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   STATUS ELEMENT
========================================================= */

function updateStatusElement(
    element,
    normal
) {

    if (!element) {

        return;

    }


    element.textContent =
        normal
            ? t("normal")
            : t("check");


    element.className =
        "status-pill " +
        (
            normal
                ? ""
                : "warning-pill"
        );

}


/* =========================================================
   QUALITY UI
========================================================= */

function updateQualityUI() {

    const quality =
        calculateCurrentQuality();


    setText(
        "fertilizerQuality",
        quality + "%"
    );


    let label =
        t("quality_excellent");


    let indicator =
        "EXCELLENT";


    if (
        quality < 85
    ) {

        label =
            t("quality_good");

        indicator =
            "GOOD";

    }


    if (
        quality < 70
    ) {

        label =
            t("quality_attention");

        indicator =
            "CHECK";

    }


    setText(
        "fertilizerQualityText",
        label
    );


    setText(
        "qualityIndicatorText",
        indicator
    );


    /*
     * TEMPERATURE QUALITY
     */

    const tempQuality =
        Math.round(

            clamp(

                100 -
                Math.abs(
                    32.5 -
                    state.temperature
                ) * 10,

                0,
                100

            )

        );


    setText(
        "tempQuality",
        tempQuality + "%"
    );


    setWidth(
        "tempQualityBar",
        tempQuality
    );


    /*
     * MOISTURE QUALITY
     */

    const moistureQuality =
        Math.round(

            clamp(

                100 -
                Math.abs(
                    60 -
                    state.moisture
                ) * 2,

                0,
                100

            )

        );


    setText(
        "moistQuality",
        moistureQuality + "%"
    );


    setWidth(
        "moistQualityBar",
        moistureQuality
    );


    /*
     * NPK QUALITY
     */

    const nQuality =
        100 -
        Math.abs(
            state.nitrogen -
            120
        ) * .35;


    const pQuality =
        100 -
        Math.abs(
            state.phosphorus -
            80
        ) * .45;


    const kQuality =
        100 -
        Math.abs(
            state.potassium -
            150
        ) * .30;


    const npkQuality =
        Math.round(

            clamp(

                (
                    nQuality +
                    pQuality +
                    kQuality
                ) / 3,

                0,
                100

            )

        );


    setText(
        "npkQuality",
        npkQuality + "%"
    );


    setWidth(
        "npkQualityBar",
        npkQuality
    );

}


/* =========================================================
   SET WIDTH
========================================================= */

function setWidth(id, value) {

    const element =
        $(id);


    if (element) {

        element.style.width =
            clamp(
                value,
                0,
                100
            ) + "%";

    }

}


/* =========================================================
   SIMULATION
========================================================= */

function updateSensors() {

    if (state.simulation) {

        /*
         * TEMPERATURE
         */

        state.temperature +=
            random(
                -.35,
                .35
            );


        /*
         * MOISTURE
         */

        state.moisture +=
            random(
                -1.2,
                1.2
            );


        /*
         * NPK
         */

        state.nitrogen +=
            random(
                -3,
                3
            );


        state.phosphorus +=
            random(
                -2,
                2
            );


        state.potassium +=
            random(
                -4,
                4
            );


        /*
         * LIMIT
         */

        state.temperature =
            clamp(
                state.temperature,
                28,
                37
            );


        state.moisture =
            clamp(
                state.moisture,
                45,
                75
            );


        state.nitrogen =
            clamp(
                state.nitrogen,
                80,
                170
            );


        state.phosphorus =
            clamp(
                state.phosphorus,
                50,
                120
            );


        state.potassium =
            clamp(
                state.potassium,
                100,
                190
            );

    }


    /*
     * AUTOMATIC CONTROL
     */

    if (
        state.autoMode
    ) {

        runAutomaticControl();

    }


    /*
     * PACKET
     */

    state.packets +=
        Math.floor(
            random(
                1,
                8
            )
        );


    state.lastUpdate =
        new Date();


    /*
     * UPDATE
     */

    updateChartData();

    updateSensorUI();

    addHistory();

    updateAnalytics();

    updateCommunicationUI();

    saveHistory();

}


/* =========================================================
   AUTOMATIC CONTROL
========================================================= */

function runAutomaticControl() {

    /*
     * FAN
     *
     * Temperature > 34°C
     */

    if (
        state.temperature > 34
    ) {

        setDeviceState(
            "fan",
            true,
            false
        );

    }


    else if (
        state.temperature < 32
    ) {

        setDeviceState(
            "fan",
            false,
            false
        );

    }


    /*
     * WATER PUMP
     *
     * Moisture < 52%
     */

    if (
        state.moisture < 52
    ) {

        setDeviceState(
            "water",
            true,
            false
        );

    }


    else if (
        state.moisture > 62
    ) {

        setDeviceState(
            "water",
            false,
            false
        );

    }


    /*
     * EM4
     *
     * Contoh simulasi:
     * EM4 aktif ketika kelembapan
     * cukup dan kualitas mulai turun.
     */

    const quality =
        calculateCurrentQuality();


    if (
        quality < 72 &&
        state.moisture >= 50 &&
        state.moisture <= 68
    ) {

        setDeviceState(
            "em4",
            true,
            false
        );

    }


    else if (
        quality >= 80
    ) {

        setDeviceState(
            "em4",
            false,
            false
        );

    }


    /*
     * SIMULASI EFEK AKTUATOR
     */

    if (
        state.devices.water
    ) {

        state.moisture +=
            random(
                .3,
                .8
            );

    }


    if (
        state.devices.fan
    ) {

        state.temperature -=
            random(
                .1,
                .35
            );

    }

}


/* =========================================================
   DEVICE CONTROL
========================================================= */

function setDeviceState(
    device,
    newState,
    showNotification = true
) {

    if (
        !state.devices.hasOwnProperty(
            device
        )
    ) {

        return;

    }


    state.devices[device] =
        Boolean(newState);


    const statusId =
        device === "em4"
            ? "em4Status"
            : device === "water"
                ? "waterStatus"
                : "fanStatus";


    const statusElement =
        $(statusId);


    if (statusElement) {

        statusElement.textContent =
            state.devices[device]
                ? "ON"
                : "OFF";


        statusElement.classList.toggle(
            "on",
            state.devices[device]
        );


        statusElement.classList.toggle(
            "off",
            !state.devices[device]
        );

    }


    document
        .querySelectorAll(
            `.device-button[data-device="${device}"]`
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                state.devices[device]
            );


            button.textContent =
                state.devices[device]
                    ? t("turn_off")
                    : t("turn_on");

        });


    updateDeviceIndicators();


    if (
        showNotification
    ) {

        const deviceName =
            device === "em4"
                ? "EM4"
                : device === "water"
                    ? (
                        state.language === "id"
                            ? "Pompa Air"
                            : "Water Pump"
                    )
                    : (
                        state.language === "id"
                            ? "Kipas"
                            : "Fan"
                    );


        showToast(

            `${deviceName} ${
                state.devices[device]
                    ? "ON"
                    : "OFF"
            }`

        );

    }

}


/* =========================================================
   INITIALIZE DEVICE BUTTON
========================================================= */

function initializeDeviceControl() {

    document
        .querySelectorAll(
            ".device-button"
        )
        .forEach(button => {

            /*
             * Hindari event listener
             * ganda
             */

            if (
                button.dataset.initialized ===
                "true"
            ) {

                return;

            }


            button.dataset.initialized =
                "true";


            button.addEventListener(
                "click",
                () => {

                    const device =
                        button.dataset.device;


                    if (
                        state.autoMode
                    ) {

                        showToast(

                            state.language === "id"

                                ? "Nonaktifkan Mode Otomatis untuk kontrol manual."

                                : "Disable Automatic Mode for manual control."

                        );

                        return;

                    }


                    const current =
                        state.devices[device];


                    setDeviceState(
                        device,
                        !current,
                        true
                    );

                }

            );

        });


    updateDeviceIndicators();

}


/* =========================================================
   DEVICE INDICATORS
========================================================= */

function updateDeviceIndicators() {

    Object.keys(
        state.devices
    ).forEach(device => {

        const active =
            state.devices[device];


        document
            .querySelectorAll(
                `[data-device="${device}"]`
            )
            .forEach(element => {

                if (
                    element.classList.contains(
                        "device-button"
                    )
                ) {

                    element.classList.toggle(
                        "active",
                        active
                    );

                }

            });

    });

}


/* =========================================================
   HISTORY
========================================================= */

function addHistory() {

    const now =
        new Date();


    state.history.unshift({

        time:
            now.toLocaleTimeString(
                "id-ID"
            ),

        temperature:
            state.temperature.toFixed(1),

        moisture:
            state.moisture.toFixed(0),

        nitrogen:
            state.nitrogen.toFixed(0),

        phosphorus:
            state.phosphorus.toFixed(0),

        potassium:
            state.potassium.toFixed(0),

        quality:
            calculateCurrentQuality(),

        status:
            calculateHealth() >= 90
                ? "NORMAL"
                : "CHECK"

    });


    if (
        state.history.length >
        50
    ) {

        state.history.pop();

    }


    renderHistory();

}


/* =========================================================
   RENDER HISTORY
========================================================= */

function renderHistory() {

    const table =
        $("historyTable");


    if (!table) {

        return;

    }


    table.innerHTML = "";


    state.history.forEach(
        (
            item,
            index
        ) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${item.time}
                </td>

                <td>
                    ${item.temperature} °C
                </td>

                <td>
                    ${item.moisture} %
                </td>

                <td>
                    ${item.nitrogen} mg/kg
                </td>

                <td>
                    ${item.phosphorus} mg/kg
                </td>

                <td>
                    ${item.potassium} mg/kg
                </td>

                <td class="${
                    item.status ===
                    "NORMAL"
                        ? "status-normal"
                        : "status-check"
                }">

                    ${
                        item.status ===
                        "NORMAL"
                            ? t("normal")
                            : t("check")
                    }

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   LOCAL STORAGE HISTORY
========================================================= */

function saveHistory() {

    try {

        localStorage.setItem(

            "smartKomposterHistory",

            JSON.stringify(
                state.history
            )

        );

    } catch (error) {

        console.warn(
            "History tidak dapat disimpan:",
            error
        );

    }

}


function loadHistory() {

    try {

        const saved =
            localStorage.getItem(
                "smartKomposterHistory"
            );


        if (
            saved
        ) {

            const parsed =
                JSON.parse(
                    saved
                );


            if (
                Array.isArray(parsed)
            ) {

                state.history =
                    parsed.slice(
                        0,
                        50
                    );

            }

        }

    } catch (error) {

        console.warn(
            "History tidak dapat dimuat:",
            error
        );

    }

}


/* =========================================================
   ANALYTICS
========================================================= */

function updateAnalytics() {

    if (
        state.history.length === 0
    ) {

        return;

    }


    const temps =
        state.history.map(
            item =>
                Number(
                    item.temperature
                )
        );


    const moist =
        state.history.map(
            item =>
                Number(
                    item.moisture
                )
        );


    const qualities =
        state.history.map(
            item =>
                Number(
                    item.quality
                )
        );


    const averageTemp =
        temps.reduce(
            (
                a,
                b
            ) =>
                a + b,
            0
        ) /
        temps.length;


    const averageMoist =
        moist.reduce(
            (
                a,
                b
            ) =>
                a + b,
            0
        ) /
        moist.length;


    const averageQuality =
        qualities.reduce(
            (
                a,
                b
            ) =>
                a + b,
            0
        ) /
        qualities.length;


    setText(
        "averageTemperature",
        averageTemp.toFixed(1) +
        "°C"
    );


    setText(
        "averageMoisture",
        averageMoist.toFixed(0) +
        "%"
    );


    setText(
        "analyticsPackets",
        state.packets.toLocaleString(
            "en-US"
        )
    );


    setText(
        "analyticsQuality",
        Math.round(
            averageQuality
        ) + "%"
    );


    updateQualityUI();

}


/* =========================================================
   COMMUNICATION STATUS
========================================================= */

function updateCommunicationUI() {

    /*
     * ATMEGA
     */

    updateConnectionElement(
        "atmegaStatus",
        state.atmega
    );


    /*
     * W5500
     */

    updateConnectionElement(
        "w5500Status",
        state.w5500
    );


    /*
     * ETHERNET
     */

    updateConnectionElement(
        "ethernetStatus",
        state.ethernet
    );


    /*
     * ESP32
     */

    updateConnectionElement(
        "esp32Status",
        state.esp32
    );


    /*
     * GENERIC CONNECTION ELEMENTS
     */

    document
        .querySelectorAll(
            ".connection-status"
        )
        .forEach(element => {

            const connected =
                element.dataset.connected !==
                "false";


            element.classList.toggle(
                "connected",
                connected
            );

            element.classList.toggle(
                "disconnected",
                !connected
            );

        });

}


function updateConnectionElement(
    id,
    connected
) {

    const element =
        $(id);


    if (!element) {

        return;

    }


    element.textContent =
        connected
            ? t("connected")
            : t("disconnected");


    element.classList.toggle(
        "connected",
        connected
    );


    element.classList.toggle(
        "disconnected",
        !connected
    );

}


/* =========================================================
   SYSTEM STATUS UI
========================================================= */

function updateSystemStatusUI() {

    const health =
        calculateHealth();


    setText(
        "systemHealthValue",
        health + "%"
    );


    setText(
        "dashboardHealthScore",
        health
    );


    /*
     * System status text
     */

    const statusText =
        health >= 90
            ? t("system_normal")
            : t("warning");


    setText(
        "systemStatusText",
        statusText
    );

}


/* =========================================================
   TRANSLATION APPLY
========================================================= */

function applyLanguage(
    language
) {

    if (
        !translations[language]
    ) {

        language = "id";

    }


    state.language =
        language;


    localStorage.setItem(
        "smartKomposterLanguage",
        language
    );


    document.documentElement.lang =
        language;


    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(element => {

            const key =
                element.dataset.i18n;


            if (
                translations[language]?.[key]
            ) {

                element.textContent =
                    translations[
                        language
                    ][key];

            }

        });


    if ($("language")) {

        $("language").value =
            language;

    }


    if ($("languageSettings")) {

        $("languageSettings").value =
            language;

    }


    updateDynamicLanguage();

    updatePageTitle();

    updateClock();

    updateSensorUI();

    renderHistory();

}


/* =========================================================
   DYNAMIC LANGUAGE
========================================================= */

function updateDynamicLanguage() {

    document
        .querySelectorAll(
            ".device-button"
        )
        .forEach(button => {

            const device =
                button.dataset.device;


            if (
                !state.devices.hasOwnProperty(
                    device
                )
            ) {

                return;

            }


            button.textContent =
                state.devices[device]
                    ? t("turn_off")
                    : t("turn_on");

        });


    updateQualityUI();

    updateCommunicationUI();

}


/* =========================================================
   PAGE TITLE
========================================================= */

function updatePageTitle() {

    const active =
        document.querySelector(
            ".nav-item.active"
        );


    if (
        !active ||
        !$("pageTitle")
    ) {

        return;

    }


    const page =
        active.dataset.page;


    const key =
        page === "status"
            ? "system_status"
            : page;


    if (
        translations[
            state.language
        ]?.[key]
    ) {

        $("pageTitle").textContent =
            translations[
                state.language
            ][key];

    }

}


/* =========================================================
   LANGUAGE EVENTS
========================================================= */

function initializeLanguageEvents() {

    $("language")
        ?.addEventListener(
            "change",
            event => {

                applyLanguage(
                    event.target.value
                );

                showToast(

                    state.language === "id"
                        ? "Bahasa diubah"
                        : "Language changed"

                );

            }
        );


    $("languageSettings")
        ?.addEventListener(
            "change",
            event => {

                applyLanguage(
                    event.target.value
                );

                showToast(

                    state.language === "id"
                        ? "Bahasa diubah"
                        : "Language changed"

                );

            }
        );

}


/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

function initializeNavigation() {

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(button => {

            if (
                button.dataset.navigationInitialized ===
                "true"
            ) {

                return;

            }


            button.dataset.navigationInitialized =
                "true";


            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;


                    if (
                        !page
                    ) {

                        return;

                    }


                    document
                        .querySelectorAll(
                            ".nav-item"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    document
                        .querySelectorAll(
                            ".page"
                        )
                        .forEach(section => {

                            section.classList.remove(
                                "active"
                            );

                        });


                    const target =
                        $(page);


                    if (target) {

                        target.classList.add(
                            "active"
                        );

                    }


                    updatePageTitle();


                    $("sidebar")
                        ?.classList.remove(
                            "open"
                        );


                    requestAnimationFrame(
                        () => {

                            resizeAllCharts();

                            createVisibleChart();

                        }
                    );

                }

            );

        });

}


/* =========================================================
   CREATE ONLY VISIBLE CHART
========================================================= */

function createVisibleChart() {

    const activePage =
        document.querySelector(
            ".page.active"
        );


    if (!activePage) {

        return;

    }


    const canvas =
        activePage.querySelector(
            "canvas"
        );


    if (!canvas) {

        return;

    }


    if (
        canvas.id ===
        "sensorChart"
    ) {

        createSensorChart();

    }


    if (
        canvas.id ===
        "npkChart"
    ) {

        createNpkChart();

    }


    if (
        canvas.id ===
        "monitorChart"
    ) {

        createMonitorChart();

    }


    if (
        canvas.id ===
        "analyticsChart"
    ) {

        createAnalyticsChart();

    }

}


/* =========================================================
   MOBILE MENU
========================================================= */

function initializeMobileMenu() {

    $("menuButton")
        ?.addEventListener(
            "click",
            () => {

                $("sidebar")
                    ?.classList.toggle(
                        "open"
                    );

            }
        );

}


/* =========================================================
   THEME
========================================================= */

function applyTheme(
    theme
) {

    if (
        theme === "dark"
    ) {

        document.body.classList.add(
            "dark"
        );

    } else {

        document.body.classList.remove(
            "dark"
        );

    }


    state.theme =
        theme;


    localStorage.setItem(
        "smartKomposterTheme",
        theme
    );


    updateThemeButton();

}


function updateThemeButton() {

    const dark =
        document.body.classList.contains(
            "dark"
        );


    if ($("themeButton")) {

        $("themeButton")
            .textContent =
            dark
                ? "☀"
                : "☾";

    }

}


function toggleTheme() {

    const dark =
        document.body.classList.contains(
            "dark"
        );


    applyTheme(
        dark
            ? "light"
            : "dark"
    );


    requestAnimationFrame(
        () => {

            resizeAllCharts();

        }
    );


    showToast(

        state.language === "id"

            ? (
                dark
                    ? "Mode terang aktif"
                    : "Mode gelap aktif"
            )

            : (
                dark
                    ? "Light mode enabled"
                    : "Dark mode enabled"
            )

    );

}


function initializeTheme() {

    applyTheme(
        state.theme
    );


    $("themeButton")
        ?.addEventListener(
            "click",
            toggleTheme
        );


    $("themeSettings")
        ?.addEventListener(
            "click",
            toggleTheme
        );

}


/* =========================================================
   SIMULATION SWITCH
========================================================= */

function initializeSimulation() {

    const simulation =
        $("simulation");


    if (!simulation) {

        return;

    }


    simulation.checked =
        state.simulation;


    simulation.addEventListener(
        "change",
        event => {

            state.simulation =
                event.target.checked;


            showToast(

                state.simulation

                    ? t(
                        "sensor_simulation_enabled"
                    )

                    : t(
                        "sensor_simulation_disabled"
                    )

            );

        }

    );

}


/* =========================================================
   AUTO MODE
========================================================= */

function initializeAutoMode() {

    const auto =
        $("autoMode");


    if (!auto) {

        return;

    }


    auto.checked =
        state.autoMode;


    auto.addEventListener(
        "change",
        event => {

            state.autoMode =
                event.target.checked;


            if (
                state.autoMode
            ) {

                showToast(
                    t(
                        "automatic_enabled"
                    )
                );


                runAutomaticControl();

            } else {

                showToast(
                    t(
                        "automatic_disabled"
                    )
                );

            }

        }

    );

}


/* =========================================================
   CLEAR HISTORY
========================================================= */

function initializeClearHistory() {

    $("clearHistory")
        ?.addEventListener(
            "click",
            () => {

                state.history =
                    [];


                localStorage.removeItem(
                    "smartKomposterHistory"
                );


                renderHistory();

                updateAnalytics();


                showToast(
                    t(
                        "history_cleared"
                    )
                );

            }
        );

}


/* =========================================================
   REFRESH BUTTON
========================================================= */

function initializeRefresh() {

    $("refreshButton")
        ?.addEventListener(
            "click",
            () => {

                updateSensors();


                showToast(
                    t(
                        "sensor_updated"
                    )
                );

            }
        );

}


/* =========================================================
   CLOCK
========================================================= */

function updateClock() {

    const now =
        new Date();


    if ($("clock")) {

        $("clock")
            .textContent =
            now.toLocaleTimeString(
                "id-ID"
            );

    }


    if ($("date")) {

        $("date")
            .textContent =

            now.toLocaleDateString(

                state.language ===
                    "id"
                    ? "id-ID"
                    : "en-US",

                {

                    day:
                        "2-digit",

                    month:
                        "short",

                    year:
                        "numeric"

                }

            );

    }

}


/* =========================================================
   VIEWPORT
========================================================= */

function updateViewportStatus() {

    const width =
        window.innerWidth;


    const height =
        window.innerHeight;


    let type =
        "Desktop";


    if (
        width <= 1100
    ) {

        type =
            "Tablet";

    }


    if (
        width <= 700
    ) {

        type =
            "Mobile";

    }


    setText(
        "viewportType",
        type
    );


    setText(
        "viewportResolution",
        `${width} × ${height}`
    );


    document.body.dataset.viewport =
        type.toLowerCase();


    document.body.classList.toggle(
        "viewport-mobile",
        width <= 700
    );


    document.body.classList.toggle(
        "viewport-tablet",
        width > 700 &&
        width <= 1100
    );


    document.body.classList.toggle(
        "viewport-desktop",
        width > 1100
    );

}


/* =========================================================
   TOAST
========================================================= */

let toastTimer =
    null;


function showToast(
    message
) {

    const toast =
        $("toast");


    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2200
        );

}


/* =========================================================
   SYSTEM SIMULATION
========================================================= */

function simulateCommunication() {

    /*
     * Dalam dashboard tugas sekolah,
     * komunikasi disimulasikan.
     *
     * Ketika nanti hardware asli
     * digunakan, bagian ini dapat
     * diganti dengan data Ethernet.
     */

    state.atmega =
        true;


    state.w5500 =
        true;


    state.ethernet =
        state.atmega &&
        state.w5500;


    state.esp32 =
        state.ethernet;


    updateCommunicationUI();

}


/* =========================================================
   CHART OBSERVER
========================================================= */

function initializeChartObserver() {

    if (
        typeof MutationObserver ===
            "undefined"
    ) {

        return;

    }


    const pages =
        document.querySelectorAll(
            ".page"
        );


    if (
        !pages.length
    ) {

        return;

    }


    const observer =
        new MutationObserver(
            mutations => {

                let changed =
                    false;


                mutations.forEach(
                    mutation => {

                        if (
                            mutation.type ===
                                "attributes" &&

                            mutation.attributeName ===
                                "class"
                        ) {

                            changed =
                                true;

                        }

                    }
                );


                if (
                    changed
                ) {

                    requestAnimationFrame(
                        () => {

                            createVisibleChart();

                            resizeAllCharts();

                        }
                    );

                }

            }
        );


    pages.forEach(
        page => {

            observer.observe(
                page,
                {

                    attributes:
                        true,

                    attributeFilter:
                        [
                            "class"
                        ]

                }
            );

        }
    );

}


/* =========================================================
   RESIZE EVENT
========================================================= */

let chartResizeTimer =
    null;


function initializeResize() {

    window.addEventListener(
        "resize",
        () => {

            updateViewportStatus();


            clearTimeout(
                chartResizeTimer
            );


            chartResizeTimer =
                setTimeout(
                    () => {

                        resizeAllCharts();

                    },
                    200
                );

        }
    );

}


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

function initializeKeyboard() {

    document.addEventListener(
        "keydown",
        event => {

            /*
             * CTRL + R
             * Tidak kita override.
             */

            /*
             * ESC:
             * tutup sidebar mobile.
             */

            if (
                event.key ===
                "Escape"
            ) {

                $("sidebar")
                    ?.classList.remove(
                        "open"
                    );

            }

        }
    );

}


/* =========================================================
   DASHBOARD INITIALIZATION
========================================================= */

function initializeDashboard() {

    console.log(
        "Smart Komposter Dashboard initializing..."
    );


    /*
     * 1.
     * Initial chart data
     */

    createInitialData();


    /*
     * 2.
     * Load history
     */

    loadHistory();


    /*
     * Jika history kosong,
     * buat beberapa data awal.
     */

    if (
        state.history.length === 0
    ) {

        addHistory();

        /*
         * Sedikit variasi
         */

        state.temperature +=
            random(
                -.2,
                .2
            );

        state.moisture +=
            random(
                -.5,
                .5
            );

        addHistory();


        state.temperature +=
            random(
                -.2,
                .2
            );

        state.moisture +=
            random(
                -.5,
                .5
            );

        addHistory();

    }


    /*
     * 3.
     * UI
     */

    updateSensorUI();

    updateAnalytics();

    updateCommunicationUI();

    updateDeviceIndicators();


    /*
     * 4.
     * Clock
     */

    updateClock();


    /*
     * 5.
     * Responsive
     */

    updateViewportStatus();


    /*
     * 6.
     * Theme
     */

    initializeTheme();


    /*
     * 7.
     * Language
     */

    initializeLanguageEvents();

    applyLanguage(
        state.language
    );


    /*
     * 8.
     * Navigation
     */

    initializeNavigation();

    initializeMobileMenu();


    /*
     * 9.
     * Device control
     */

    initializeDeviceControl();


    /*
     * 10.
     * Simulation
     */

    initializeSimulation();


    /*
     * 11.
     * Automatic mode
     */

    initializeAutoMode();


    /*
     * 12.
     * Buttons
     */

    initializeClearHistory();

    initializeRefresh();


    /*
     * 13.
     * Chart observer
     */

    initializeChartObserver();


    /*
     * 14.
     * Resize
     */

    initializeResize();


    /*
     * 15.
     * Keyboard
     */

    initializeKeyboard();


    /*
     * 16.
     * Communication simulation
     */

    simulateCommunication();


    /*
     * 17.
     * Chart
     */

    requestAnimationFrame(
        () => {

            createAllCharts();


            requestAnimationFrame(
                () => {

                    resizeAllCharts();

                }
            );

        }
    );


    console.log(
        "Smart Komposter Dashboard ready."
    );

}


/* =========================================================
   DOM READY
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeDashboard
    );

} else {

    initializeDashboard();

}


/* =========================================================
   REAL-TIME SENSOR UPDATE
========================================================= */

setInterval(
    () => {

        updateSensors();

    },
    3000
);


/* =========================================================
   CLOCK UPDATE
========================================================= */

setInterval(
    () => {

        updateClock();

    },
    1000
);


/* =========================================================
   COMMUNICATION HEARTBEAT
========================================================= */

setInterval(
    () => {

        simulateCommunication();

    },
    5000
);


/* =========================================================
   FINAL LOAD CHECK
========================================================= */

window.addEventListener(
    "load",
    () => {

        requestAnimationFrame(
            () => {

                resizeAllCharts();

                createVisibleChart();

            }
        );

    }
);