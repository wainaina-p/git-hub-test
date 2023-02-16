import { CLAIMS } from "_helpers/apis";
import request from '_helpers/request';

function fetchClaims(params){
    return request(CLAIMS, {params});
}

export const claimsService ={
    fetchClaims,
    
};