export const ACTION_TYPE = {
    START_SEARCH: 'startSearch', 
    END_SEARCH : 'endSearch',
    SHOW_DIALOG : 'showDialog',
    HIDE_DIALOG : 'hideDialog'
};

export const initialState = {
    keys: [],
    showSpinner: false,
    displayModal: false,
    isEdit: false
};

export function reducer(state: any, action: any) {
    switch (action.type) {
        case ACTION_TYPE.START_SEARCH:           
            return { ...state, showSpinner: true };
        case ACTION_TYPE.END_SEARCH:
            return { ...state, keys: action.payload.keys, showSpinner: false };
        case ACTION_TYPE.SHOW_DIALOG:        
            return { ...state, isEdit: action.payload.isEdit, displayModal: true };
        case ACTION_TYPE.HIDE_DIALOG:
            return { ...state, displayModal: false };
        default:
            throw new Error();
    }
}