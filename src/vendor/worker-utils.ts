export const ACTION_INIT = "INIT"
export const ACTION_MESSAGE = "MSG"
export const ACTION_PROCESS = "PROCESS"
export const ACTION_RESULT = "RESULT"
export const ACTION_STATUS = "STAUS"
export const ACTION_ERROR = "ERROR"

export const createInitAction = () => ({ type: ACTION_INIT })
export const createMessageAction = (msg: string) => ({ type: ACTION_MESSAGE, payload: msg })
export const createProcessAction = <T>(file: T) => ({ type: ACTION_PROCESS, payload: file })
export const createResultAction = <T>(res: T) => ({ type: ACTION_RESULT, payload: res })
export const createSatusAction = (status: string) => ({ type: ACTION_STATUS, payload: status })
export const createErrorAction = (error: string) => ({ type: ACTION_ERROR, payload: error })
