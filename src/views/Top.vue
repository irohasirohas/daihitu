<script setup>
import csvtojson from 'csvtojson'
import { ref } from "vue";
import { useTemplateRef } from "vue";
import { createPdfFromHtml } from "/src/logic.js";

const $input_form = ref(null);
let $cards = useTemplateRef("cards")
const csvData = ref(null);

const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = async (e) => {
            const content = e.target.result;
            console.log("File content:", content);  // デバッグ用に追加
            try {
                // CSVデータをJSONに変換（オプションを削除）
                csvData.value = await csvtojson().fromString(content);

                const sliceByNumber = (data) => {
                    const length = Math.ceil(data.length / 10)
                    return new Array(length).fill().map((_, i) =>
                        data.slice(i * 10, (i + 1) * 10)
                    )
                }
                csvData.value = sliceByNumber(csvData.value)
                
            } catch (error) {
                console.error("Error converting CSV:", error);
            }
        };
        reader.readAsText(file);
    }
};

const convertHtml = async() => {
    createPdfFromHtml($cards.value)
}

const getColor = (color) => {
    const textColor = {
        'オレンジ': 'orange',
        '赤': 'red',
        'ピンク': 'pink',
        '紫': 'purple',
        '水色': 'lightblue',
        '黄色': 'yellow',
        '緑': 'green',
        '黒': 'black'
    }[color]

    return textColor
}

</script>

<template>
    <div class="p-2">
        <div class="text-xl font-bold mb-4">メセカ用ツール</div>
        <div class="flex items-center mb-6">
            <input type="file" @change="handleFileUpload" class="mr-8"/>
            <div>
                <div @click="convertHtml" class="inline-block border border-gray-600 rounded py-2 px-6 cursor-pointer">PDFをダウンロード</div>
            </div>
        </div>
        
        <div v-for="(data, index) in csvData">
            <div class="font-bold">{{ index + 1 }}ページ目</div>
            <div ref="cards" class="flex flex-wrap content-start container fs14">
                <div class="relative w-2/4 pr-1 pb-1" v-for="(row, index) in data" :key="index">

                    <div class="w-full" v-if="row['記入するメッセージカード'] == 'ウインク柄'">
                        <img class="object-contain block w-full" src="/src/assets/uinku.jpg" alt="">
                    </div>
                    <div class="w-full" v-if="row['記入するメッセージカード'] == 'もぐもぐ柄'">
                        <img class="object-contain block w-full" src="/src/assets/mogumogu.jpg" alt="">
                    </div>
                    <div class="absolute innerContents" :class="getColor(row['文字の色'])">
                        <div class="flex flex-col fbw h-full">
                            <div>{{ row['お祝いメッセージ本文'] }}</div>
                            <div class="font-bold left30">{{ row['おなまえ(メセカに記載する名義)'] }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    data(){
        return {
            count: 0,
            messages: []
        }
    },
    setup() {
        // テンプレートや他の Options API フックを公開します
        return {
            onhoge,
            onInputFile
        }
    },
}
</script>
  