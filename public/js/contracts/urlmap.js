/**
 * Created by gumm on 2015/12/05.
 */

goog.provide('contracts.urlMap');


contracts.urlMap = {
  INDEX: '/',
  LOG: {
    AUTO: '/auto',
    IN: '/login',
    OUT: '/logout',
    HEADER: '/login/header'
  },
  ROOT: {
    INTRO: '/intro',
    HEADER: '/header'
  },
  DRAW: {
    LEFT: '/pan/left',
    RIGHT: '/pan/right',
    CANVAS: '/canvas'
  },
  PW: {
    LOST: '/pw/lost',
    RESET: '/pwreset',
    EDIT: '/pw/edit'
  },
  ACCOUNTS: {
    CREATE: '/accs/create',
    EDIT_OR_DELETE: '/accs/eord'
  },
  PICS: {
    CREATE: '/pic/create',
    READ: '/pic/read',
    UPDATE: '/pic/update',
    DELETE: '/pic/delete',
    COLORS: '/pic/colors'
  }
};
