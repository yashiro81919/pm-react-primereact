export const ACTION_TYPE = {
    START_SEARCH: 'startSearch', 
    END_SEARCH : 'endSearch',
    SHOW_DIALOG : 'showDialog',
    HIDE_DIALOG : 'hideDialog',
    FILTER_CMCS : 'filterCmcs'
};

export const initialState = {
    cmcObjs: [],
    cryptos: [],
    total: 0,
    filteredCmcs: [],
    showSpinner: false,
    displayModal: false,
    isEdit: false    
};

export function reducer(state, action) {
    switch (action.type) {
        case ACTION_TYPE.START_SEARCH:
            return { ...state, showSpinner: true };
        case ACTION_TYPE.END_SEARCH:
            return { ...state, cryptos: action.payload.cryptos, total: action.payload.total, cmcObjs: action.payload.cmcObjs, showSpinner: false };
        case ACTION_TYPE.FILTER_CMCS:
            return { ...state, filteredCmcs: action.payload.filteredCmcs };
        case ACTION_TYPE.SHOW_DIALOG:        
            return { ...state, isEdit: action.payload.isEdit, displayModal: true };
        case ACTION_TYPE.HIDE_DIALOG:
            return { ...state, displayModal: false };            
        default:
            throw new Error();
    }
}