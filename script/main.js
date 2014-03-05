$(function(){
  
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    
    // Setup the dnd listeners.
    var dropZone = document.getElementById('dropzone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);
    
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
});

var pointer = 0, data;
var read = function(_size){
  var start = pointer;
  pointer += _size;
  return data.subarray(start,pointer);
}
var move = function(_offset){
  pointer = _offset;
}
var getOffset = function(){
  return pointer;
}

function handleFileSelect(e) {
  e.stopPropagation();
  e.preventDefault();

  var files = e.dataTransfer.files;

  // Loop through the FileList and render image files as thumbnails.
  for (var i = 0, f; f = files[i]; i++) {

    var reader = new FileReader();
    reader.onload = function(theFile) {
      data = new Uint8Array(reader.result);
      var i = 0,
          FontInfo = {};

      FontInfo['OffsetTable'] = {};
      FontInfo.OffsetTable['version']       = u8ArrToStr(read(4));
      FontInfo.OffsetTable['numTables']     = parseInt(u8ArrToStr(read(2)),16);
      FontInfo.OffsetTable['searchRange']   = parseInt(u8ArrToStr(read(2)),16);
      FontInfo.OffsetTable['entrySelector'] = parseInt(u8ArrToStr(read(2)),16);
      FontInfo.OffsetTable['rangeShift']    = parseInt(u8ArrToStr(read(2)),16);

      FontInfo['TableDirectory'] = {};
      for (i = 0; i < FontInfo.OffsetTable.numTables; i++) {
        var tag = String.fromCharCode.apply(null, read(4));
        FontInfo.TableDirectory[tag] = {};
        FontInfo.TableDirectory[tag]['checkSum'] = '0x'+u8ArrToStr(read(4));
        FontInfo.TableDirectory[tag]['offset'] = parseInt(u8ArrToStr(read(4)),16);
        FontInfo.TableDirectory[tag]['length'] = parseInt(u8ArrToStr(read(4)),16);
      }
      
      // move to "name"Table
      move(FontInfo.TableDirectory.name.offset);

      FontInfo['name'] = {};
      FontInfo.name['format'] = parseInt(u8ArrToStr(read(2)),16);
      FontInfo.name['numberOfRecords'] = parseInt(u8ArrToStr(read(2)),16);
      FontInfo.name['records'] = [];
      var storageOffset = getOffset()+(12*FontInfo.name.numberOfRecords); 
      for (i = 0; i < FontInfo.name.numberOfRecords; i++) {
        var obj = {};
        obj['offset']     = parseInt(u8ArrToStr(read(2)),16);
        obj['platformID'] = parseInt(u8ArrToStr(read(2)),16);
        obj['encordingID']= parseInt(u8ArrToStr(read(2)),16);
        obj['languageID'] = parseInt(u8ArrToStr(read(2)),16);
        obj['nameID']     = parseInt(u8ArrToStr(read(2)),16);
        obj['length']     = parseInt(u8ArrToStr(read(2)),16);
        FontInfo.name.records.push(obj);
      }
      var storageOffset = FontInfo.TableDirectory.name.offset; // 文字ストレージの先頭
      for (i = 0; i < FontInfo.name.numberOfRecords; i++) {
        var _offset = storageOffset + FontInfo.name.records[i].offset;
        move(_offset);
        FontInfo.name.records[i]['nameString'] = utf8_hex_string_to_string(u8ArrToStr(read(FontInfo.name.records[i].length)));
      }


      // output
      $('#output').html(JSON.stringify(FontInfo, null, '\t'));
    }
    reader.readAsArrayBuffer(f);
  }
}

function handleDragOver(e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// ++++++++++++++++++++++++++++++++++++++++++++
// Utility

function u8ArrToStr(u8array){
  // u8array : big endian
  var result = '';
  for (var i=0; i<u8array.length; i++) {
    result += ('00'+u8array[i].toString(16)).substr(-2);
  }
  return result;
}

// ++++++++++++++++++++++++++++++++++++++++++++

// http://d.hatena.ne.jp/yasuhallabo/20140211/1392131668

// UTF8の16進文字列を文字列に変換
function utf8_hex_string_to_string(hex_str1){
  var bytes2 = hex_string_to_bytes(hex_str1);
  var str2 = utf8_bytes_to_string(bytes2);
  return str2;
}
// バイト配列を16進文字列に変換
function hex_string_to_bytes(hex_str){
  var result = [];
  for (var i = 0; i < hex_str.length; i+=2) {
    result.push(hex_to_byte(hex_str.substr(i,2)));
  }
  return result;
}
// 16進文字列をバイト値に変換
function hex_to_byte(hex_str){
  return parseInt(hex_str, 16);
}
// UTF8のバイト配列を文字列に変換
function  utf8_bytes_to_string  (arr){
  if(arr == null) return null;
  var result = "";
  var i;
  while(i = arr.shift()) {
    if(i <= 0x7f) {
      result += String.fromCharCode(i);
    }
    else if(i <= 0xdf) {
      var c = ((i&0x1f)<<6);
      c += arr.shift()&0x3f;
      result += String.fromCharCode(c);
    }
    else if(i <= 0xe0) {
      var c = ((arr.shift()&0x1f)<<6)|0x0800;
      c += arr.shift()&0x3f;
      result += String.fromCharCode(c);
    }
    else {
      var c = ((i&0x0f)<<12);
      c += (arr.shift()&0x3f)<<6;
      c += arr.shift() & 0x3f;
      result += String.fromCharCode(c);
    }
  }
  return result;
}





var cid = {
"842":"ぁ",
"843":"あ",
"844":"ぃ",
"845":"い",
"846":"ぅ",
"847":"う",
"848":"ぇ",
"849":"え",
"850":"ぉ",
"851":"お",
"852":"か",
"853":"が",
"854":"き",
"855":"ぎ",
"856":"く",
"857":"ぐ",
"858":"け",
"859":"げ",
"860":"こ",
"861":"ご",
"862":"さ",
"863":"ざ",
"864":"し",
"865":"じ",
"866":"す",
"867":"ず",
"868":"せ",
"869":"ぜ",
"870":"そ",
"871":"ぞ",
"872":"た",
"873":"だ",
"874":"ち",
"875":"ぢ",
"876":"っ",
"877":"つ",
"878":"づ",
"879":"て",
"880":"で",
"881":"と",
"882":"ど",
"883":"な",
"884":"に",
"885":"ぬ",
"886":"ね",
"887":"の",
"888":"は",
"889":"ば",
"890":"ぱ",
"891":"ひ",
"892":"び",
"893":"ぴ",
"894":"ふ",
"895":"ぶ",
"896":"ぷ",
"897":"へ",
"898":"べ",
"899":"ぺ",
"900":"ほ",
"901":"ぼ",
"902":"ぽ",
"903":"ま",
"904":"み",
"905":"む",
"906":"め",
"907":"も",
"908":"ゃ",
"909":"や",
"910":"ゅ",
"911":"ゆ",
"912":"ょ",
"913":"よ",
"914":"ら",
"915":"り",
"916":"る",
"917":"れ",
"918":"ろ",
"919":"ゎ",
"920":"わ",
"921":"ゐ",
"922":"ゑ",
"923":"を",
"924":"ん",
"925":"ァ",
"926":"ア",
"927":"ィ",
"928":"イ",
"929":"ゥ",
"930":"ウ",
"931":"ェ",
"932":"エ",
"933":"ォ",
"934":"オ",
"935":"カ",
"936":"ガ",
"937":"キ",
"938":"ギ",
"939":"ク",
"940":"グ",
"941":"ケ",
"942":"ゲ",
"943":"コ",
"944":"ゴ",
"945":"サ",
"946":"ザ",
"947":"シ",
"948":"ジ",
"949":"ス",
"950":"ズ",
"951":"セ",
"952":"ゼ",
"953":"ソ",
"954":"ゾ",
"955":"タ",
"956":"ダ",
"957":"チ",
"958":"ヂ",
"959":"ッ"
};

