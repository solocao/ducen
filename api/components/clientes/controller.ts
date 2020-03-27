import * as consult from '../../helpers/consult';
import * as links from '../../helpers/links'
import * as respuestas from '../../errors'
import { ICliente } from './model';

const model = "adm_clientes";

/**
 * Get all clients
 * @param query modifier of the consult
 */
export const get = async (query: any): Promise<any> => {
    try {
        let data: ICliente[] = await consult.get(model, query);
        let totalCount: number = await consult.count(model); // consulto el total de registros de la BD
        let count = data.length;
        let { limit } = query;

        if (count <= 0) return respuestas.Empty;
        
        let link = links.pages(data, model, count, totalCount, limit);
        let response = Object.assign({ totalCount, count, data }, link);
        return {response,code:respuestas.Ok.code};
    } catch (error) {
        if (error.message == 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Get one client
 * @param id id of the client
 * @param query modifier of the consult
 */
export const getOne = async (id: string | number, query: any): Promise<any> => {
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let data: ICliente[] = await consult.getOne(model, id, query);
        let count: number = await consult.count(model);

        if (!data) return respuestas.ElementNotFound;

        let link = links.records(data, model, count);
        let response = Object.assign({ data }, link);
        return {response,code:respuestas.Ok.code};
    } catch (error) {
        if (error.message == 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Create a new client
 * @param body data of the new client
 */
export const create = async (body: any): Promise<any> => {
    let { data } = body;
    let newCliente: ICliente = data;
    try {
        let { insertId } = await consult.create(model, newCliente);
        let link = links.created(model, insertId);
        let response = Object.assign({ message: respuestas.Created.message}, { link: link });
        return { response, code: respuestas.Created.code };
    } catch (error) {
        if (error.message == 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}
/**
 * Update a client data
 * @param params params request object
 * @param body data of the cliente
 */
export const update = async (params: any, body: any): Promise<any> => {
    const { id } = params;
    let { data } = body;
    let newCliente: ICliente = data;

    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        let { affectedRows } = await consult.update(model, id, newCliente);
        let link = links.created(model, id);
        let response = Object.assign({ message: respuestas.Update.message, affectedRows }, { link: link });
        return { response, code: respuestas.Update.code };
    } catch (error) {
        if (error.message == 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}

/**
 * Delete a client
 * @param params params request object
 */
export const remove = async (params: any): Promise<any> => {
    let { id } = params;
    try {
        if (isNaN(id as number)) return respuestas.InvalidID;

        await consult.remove(model, id);
        return respuestas.Deleted;
    } catch (error) {
        if (error.message == 'BD_SYNTAX_ERROR') return respuestas.BadRequest;
        console.log(`Error en el controlador ${model}, error: ${error}`);
        return respuestas.InternalServerError;
    }
}