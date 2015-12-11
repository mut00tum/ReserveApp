var reserve     = require( './m/reserve' );
var resize      = require( './ui/resize' );
var changeWeek  = require( './ui/changeWeek' );
var times       = require( './ui/times' );
var reserveCard = require( './ui/reserveCard' );

// mithril
reserve();

// UI
changeWeek();
times();
reserveCard(); 