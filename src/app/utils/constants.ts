export enum ObjectLocalStorage {
    CURRENT_USER = 'currentUser'
}

export enum TaskTelecomStatus {
    STATUS_CANCEL = -1,
    STATUS_INIT = 0,
    STATUS_PROCESSING = 2, //giao dịch viên đã bấm tiếp nhận yêu cầu
    STATUS_PROCESS_TO_MNO = 3, //Đã đẩy sang đối tác nhà mạng
    STATUS_REJECT = 4, //Đấu nối sang nhà mạng thất bại
    STATUS_SUCCESS = 1, //Thành công
    STATUS_NEW_ORDER = 5,
    STATUS_SUCCESS_PART = 11, 
    STATUS_INIT_2G_GSIM = 20// THành công 1 phần
}

export enum MsisdnStatus {
    STATUS_NOT_PROCESS_MNO = 2,
    STATUS_PROCESSED_MNO_FAIL = 3,
    STATUS_PROCESSED_MNO_SUCCESS = 1,
    STATUS_LOCKED = 30
}

export enum TelecomAction {
    TOPUP = "TOPUP",
    ORDER_NUMBER = "ORDER_NUMBER",
    GENERATE_CONTRACT = "GENERATE_CONTRACT",
    REQUIRE_TO_PREPAID = "REQUIRE_TO_PREPAID"
}


export class TaskTelecom {
    static ACTION = {
        new_sim: {
            value: 'new_sim',
            label: 'Đăng ký mới'
        },
        change_info: {
            value: 'change_info',
            label: 'Đổi sim'
        },
        change_user_info: {
            value: 'change_user_info',
            label: 'Đổi thông tin'
        }
    };
}

export class TelecomConst {
    public static TELCO = [
        {
            code: 'VTT',
            desc: 'Viettel'
        },
        {
            code: 'VMS',
            desc: 'Mobifone'
        },
        {
            code: 'VNM',
            desc: 'Vietnammobile'
        },
        {
            code: 'VNP',
            desc: 'Vinaphone'
        }
    ]
}



export enum STORAGE_KEY {
    FCM_SUBSCRIBE = 'fcm_subscribe'
}


export enum TaskAction {
    ORDER_NUMBER = "ORDER_NUMBER",
    TOPUP = "TOPUP",
    TOPUP_2G = "TOPUP_2G",
    REQUIRE_TO_PREPAID = "REQUIRE_TO_PREPAID",
    GENERATE_CONTRACT = 'GENERATE_CONTRACT',
    EVICTION = "EVICTION"
}

export enum TASK_DETAIL {
    GConversion = '2G_Conversion'
}

export enum SUB_ACTION {
    TRA_SAU_SANG_TRA_TRUOC = 'tra_sau_sang_tra_truoc',
    TRA_TRUOC = 'tra_truoc'
}