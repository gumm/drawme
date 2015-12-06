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
    HOME: '/home',
    INTRO: '/intro',
    HEADER: '/header'
  },
  PW: {
    LOST: '/pw/lost',
    RESET: '/pw/reset',
    EDIT: '/pw/edit'
  },
  ACCOUNTS: {
    CREATE: '/accs/create',
    READ: '/accs/read',
    UPDATE: '/accs/update',
    DELETE: '/accs/delete'
  },
  PICS: {
    CREATE: '/pic/create',
    READ: '/pic/read',
    UPDATE: '/pic/update',
    DELETE: '/pic/delete'
  }
};
