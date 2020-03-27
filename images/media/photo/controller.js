const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const { DATA_URL } = require('../../keys');
const { tablas } = require('./models');

async function getPhotosOfGallery(req, res) {
    try {
        const { table, id } = req.params;
        let model = tableSelector(table);
        if (model == '') return res.status(400).json({ message: 'Bad request' });

        const { data } = await axios.get(`${DATA_URL}/${model}/${id}/rest_galeria`);
        let imagenes = [];
        for (let index = 0; index < data.length; index++) {
            const element = array[index];
            imagenes.push('http://localhost:81/api/img/uploads/' + element.imagen);
        }
        return res.status(200).json({ id, imagenes });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function getMainPhoto(req, res) {
    try {
        const { table, id } = req.params;
        let model = tableSelector(table);
        if (model == '') return res.status(400).json({ message: 'Bad request' });

        const { data } = await axios.get(`${DATA_URL}/${model}/${id}/`, { query: { fields: 'id,imagen' } });
        data.imagen = 'http://localhost:81/api/img/uploads/' + data.image;
        return res.status(200).json({ data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function insertGalleryPhoto(req,res){
    try {
        const { table, id } = req.params;
        const { filename } = req.file;
        let model = tableSelector(table);
        if (model == '') return res.status(400).json({ message: 'Bad request' });
        const { data } = await axios.get(`${DATA_URL}/${model}/${id}/`, { query: { fields: 'id,imagen' } });
        if(!data) return res.status(404).json({message:'This element not exist'});

        await axios.post(`${DATA_URL}/rest_galeria`, {data:{adm_conceptos_id:id,imagen:filename}});

        return res.status(201).json({message:'Image inserted'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });s
    }
}

async function insertMainPhoto(req,res){
    try {
        const { table, id } = req.params;
        const { filename } = req.file;
        let model = tableSelector(table);
        if (model == '') return res.status(400).json({ message: 'Bad request' });
        const { data } = await axios.get(`${DATA_URL}/${model}/${id}/`, { query: { fields: 'id,imagen' } });
        if(!data) return res.status(404).json({message:'This element not exist'});

        await axios.post(`${DATA_URL}/${model}/${id}/`, {data:{imagen:filename}});

        return res.status(201).json({message:'Image inserted'});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });s
    }
}

async function upsertGalleryPhoto(req,res){
    try {
        const { table, id } = req.params;
        const { filename } = req.file;
        let model = tableSelector(table);
        if (model == '') return res.status(400).json({ message: 'Bad request' });
        const { data } = await axios.get(`${DATA_URL}/${model}/${id}/`, { query: { fields: 'id,imagen' } });
        if(!data) return res.status(404).json({message:'This element not exist'});

        await fs.unlink(path.resolve(__dirname,`/public/img/${data.imagen}`));

        await axios.post(`${DATA_URL}/rest_galeria`, {data:{adm_conceptos_id:id,imagen:filename}});

        return res.status(201).json({message:'Image inserted'});
    } catch (error) {
        
    }
}

function tableSelector(table) {
    let model = '';
    for (const key in tablas) {
        if (key == table) model = tablas[key];
    }
    return model;
}
module.exports = {
    getPhotosOfGallery,
    getMainPhoto,
    insertGalleryPhoto,
    insertMainPhoto
}