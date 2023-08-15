export const JWT = {
    saltRounds: 2,
    jwtSecret: "miliscot_its-a-bae`s-a_dragonEGG-secret",
    tokenExpireTime: "72h",
};

export const GENDER = {
    MALE: 'MALE',
    FEMALE: 'FEMALE'
}

export const USER_TYPE = {
    ADMIN: 'ADMIN',
    STUDENT: 'STUDENT',
    // STAFF: 'STAFF'
}

export const BOOK_STATUS = {
  PENDING: 'PENDING',
  PUBLISHED: 'PUBLISHED',
  UNPUBLISHED: 'UNPUBLISHED',
  OUTDATED: 'OUTDATED',
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE'
}

export const TRANSACTION_TYPE = {
  RESERVE: 'RESERVE', 
  ISSUE: 'ISSUE'
}

export const TRANSACTION_STATUS = {
  ACTIVE: 'ACTIVE', 
  DUE: 'DUE', 
  CLOSED: 'CLOSED'
}

export const DATABASE = {
    ERP_VERSION: 1,
    OBJECT_ID_REGEX: /^[0-9a-fA-F]{24}$/,
    PRELOAD_TABLE_DATA: { TRUE: true, FALSE: false, DEFAULT: false },
    RECORD_STATUS: {
      REJECTED: 0,
      PENDING: 1,
      APPROVED: 2,
      AUDITED: 3,
      CLOSED: 4,
    },
    BASE_ID: {
      COUNTRY: "5c51bc91860d8bab00000001",
      REGION: "5c51bc91860d8bbc00000001",
    },
    OPTIONS: {
      timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
      autoIndex: true,
      minimize: false,
      versionKey: false,
      toJSON: {
        virtuals: true,
        // eslint-disable-next-line object-shorthand
        transform: function (doc, ret) {
          ret.id = ret._id;
          // ret.createdAt = ret.created_at;
          // ret.updatedAt = ret.updated_at;
          delete ret._id;
          delete ret.updated_at;
          delete ret.created_at;
          delete ret.__v;
        },
      },
      toObject: { virtuals: true },
    },
  };
  