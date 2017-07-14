/**
 * Created by Administrator on 2017/5/16.
 */
var TCP_INFO_SIZE = 4
var DWORD_MASK = 0xFFFFFFFF
var WOFR_MASK = 0xFFFF
var BYTE_MASK = 0xFF
var PACKET_KEY = 0xFCDA9527

g_SendByteMap = new Uint8Array([0x70, 0x2F, 0x40, 0x5F, 0x44, 0x8E,
    0x6E, 0x45, 0x7E, 0xAB, 0x2C, 0x1F, 0xB4, 0xAC, 0x9D, 0x91, 0x0D,
    0x36, 0x9B, 0x0B, 0xD4, 0xC4, 0x39, 0x74, 0xBF, 0x23, 0x16, 0x14,
    0x06, 0xEB, 0x04, 0x3E, 0x12, 0x5C, 0x8B, 0xBC, 0x61, 0x63, 0xF6,
    0xA5, 0xE1, 0x65, 0xD8, 0xF5, 0x5A, 0x07, 0xF0, 0x13, 0xF2, 0x20,
    0x6B, 0x4A, 0x24, 0x59, 0x89, 0x64, 0xD7, 0x42, 0x6A, 0x5E, 0x3D,
    0x0A, 0x77, 0xE0, 0x80, 0x27, 0xB8, 0xC5, 0x8C, 0x0E, 0xFA, 0x8A,
    0xD5, 0x29, 0x56, 0x57, 0x6C, 0x53, 0x67, 0x41, 0xE8, 0x00, 0x1A,
    0xCE, 0x86, 0x83, 0xB0, 0x22, 0x28, 0x4D, 0x3F, 0x26, 0x46, 0x4F,
    0x6F, 0x2B, 0x72, 0x3A, 0xF1, 0x8D, 0x97, 0x95, 0x49, 0x84, 0xE5,
    0xE3, 0x79, 0x8F, 0x51, 0x10, 0xA8, 0x82, 0xC6, 0xDD, 0xFF, 0xFC,
    0xE4, 0xCF, 0xB3, 0x09, 0x5D, 0xEA, 0x9C, 0x34, 0xF9, 0x17, 0x9F,
    0xDA, 0x87, 0xF8, 0x15, 0x05, 0x3C, 0xD3, 0xA4, 0x85, 0x2E, 0xFB,
    0xEE, 0x47, 0x3B, 0xEF, 0x37, 0x7F, 0x93, 0xAF, 0x69, 0x0C, 0x71,
    0x31, 0xDE, 0x21, 0x75, 0xA0, 0xAA, 0xBA, 0x7C, 0x38, 0x02, 0xB7,
    0x81, 0x01, 0xFD, 0xE7, 0x1D, 0xCC, 0xCD, 0xBD, 0x1B, 0x7A, 0x2A,
    0xAD, 0x66, 0xBE, 0x55, 0x33, 0x03, 0xDB, 0x88, 0xB2, 0x1E, 0x4E,
    0xB9, 0xE6, 0xC2, 0xF7, 0xCB, 0x7D, 0xC9, 0x62, 0xC3, 0xA6, 0xDC,
    0xA7, 0x50, 0xB5, 0x4B, 0x94, 0xC0, 0x92, 0x4C, 0x11, 0x5B, 0x78,
    0xD9, 0xB1, 0xED, 0x19, 0xE9, 0xA1, 0x1C, 0xB6, 0x32, 0x99, 0xA3,
    0x76, 0x9E, 0x7B, 0x6D, 0x9A, 0x30, 0xD6, 0xA9, 0x25, 0xC7, 0xAE,
    0x96, 0x35, 0xD0, 0xBB, 0xD2, 0xC8, 0xA2, 0x08, 0xF3, 0xD1, 0x73,
    0xF4, 0x48, 0x2D, 0x90, 0xCA, 0xE2, 0x58, 0xC1, 0x18, 0x52, 0xFE,
    0xDF, 0x68, 0x98, 0x54, 0xEC, 0x60, 0x43, 0x0F]);

g_RecvByteMap= new Uint8Array([0x51, 0xA1, 0x9E, 0xB0, 0x1E, 0x83,
    0x1C, 0x2D, 0xE9, 0x77, 0x3D, 0x13, 0x93, 0x10, 0x45, 0xFF, 0x6D,
    0xC9, 0x20, 0x2F, 0x1B, 0x82, 0x1A, 0x7D, 0xF5, 0xCF, 0x52, 0xA8,
    0xD2, 0xA4, 0xB4, 0x0B, 0x31, 0x97, 0x57, 0x19, 0x34, 0xDF, 0x5B,
    0x41, 0x58, 0x49, 0xAA, 0x5F, 0x0A, 0xEF, 0x88, 0x01, 0xDC, 0x95,
    0xD4, 0xAF, 0x7B, 0xE3, 0x11, 0x8E, 0x9D, 0x16, 0x61, 0x8C, 0x84,
    0x3C, 0x1F, 0x5A, 0x02, 0x4F, 0x39, 0xFE, 0x04, 0x07, 0x5C, 0x8B,
    0xEE, 0x66, 0x33, 0xC4, 0xC8, 0x59, 0xB5, 0x5D, 0xC2, 0x6C, 0xF6,
    0x4D, 0xFB, 0xAE, 0x4A, 0x4B, 0xF3, 0x35, 0x2C, 0xCA, 0x21, 0x78,
    0x3B, 0x03, 0xFD, 0x24, 0xBD, 0x25, 0x37, 0x29, 0xAC, 0x4E, 0xF9,
    0x92, 0x3A, 0x32, 0x4C, 0xDA, 0x06, 0x5E, 0x00, 0x94, 0x60, 0xEC,
    0x17, 0x98, 0xD7, 0x3E, 0xCB, 0x6A, 0xA9, 0xD9, 0x9C, 0xBB, 0x08,
    0x8F, 0x40, 0xA0, 0x6F, 0x55, 0x67, 0x87, 0x54, 0x80, 0xB2, 0x36,
    0x47, 0x22, 0x44, 0x63, 0x05, 0x6B, 0xF0, 0x0F, 0xC7, 0x90, 0xC5,
    0x65, 0xE2, 0x64, 0xFA, 0xD5, 0xDB, 0x12, 0x7A, 0x0E, 0xD8, 0x7E,
    0x99, 0xD1, 0xE8, 0xD6, 0x86, 0x27, 0xBF, 0xC1, 0x6E, 0xDE, 0x9A,
    0x09, 0x0D, 0xAB, 0xE1, 0x91, 0x56, 0xCD, 0xB3, 0x76, 0x0C, 0xC3,
    0xD3, 0x9F, 0x42, 0xB6, 0x9B, 0xE5, 0x23, 0xA7, 0xAD, 0x18, 0xC6,
    0xF4, 0xB8, 0xBE, 0x15, 0x43, 0x70, 0xE0, 0xE7, 0xBC, 0xF1, 0xBA,
    0xA5, 0xA6, 0x53, 0x75, 0xE4, 0xEB, 0xE6, 0x85, 0x14, 0x48, 0xDD,
    0x38, 0x2A, 0xCC, 0x7F, 0xB1, 0xC0, 0x71, 0x96, 0xF8, 0x3F, 0x28,
    0xF2, 0x69, 0x74, 0x68, 0xB7, 0xA3, 0x50, 0xD0, 0x79, 0x1D, 0xFC,
    0xCE, 0x8A, 0x8D, 0x2E, 0x62, 0x30, 0xEA, 0xED, 0x2B, 0x26, 0xB9,
    0x81, 0x7C, 0x46, 0x89, 0x73, 0xA2, 0xF7, 0x72]);


function msgParse() {
    this.m_cbSendRound = 0
    this.m_cbRecvRound = 0
    this.m_dwSendXorKey = rand()
    this.m_dwRecvXorKey = this.m_dwSendXorKey
    this.m_dwSendTickCount = 0
    this.m_dwRecvTickCount = 0
    this.m_dwSendPacketCount = 0
    this.m_dwRecvPacketCount = 0
}

msgParse.prototype.EncryptBuffer =function (u8buffer) {
    wDataSize = u8buffer.byteLength
    cc.log(" old data size == ", wDataSize)
    //调整长度
    var  wEncryptSize = wDataSize- TCP_INFO_SIZE,wSnapCount = 0;
    var pcbDataBuffer
    if (wEncryptSize % 4 != 0 ){
        wSnapCount = 4 - wEncryptSize % 4
        var appendBuff =  new Uint8Array(wSnapCount)
        pcbDataBuffer = new (u8buffer.constructor)(u8buffer.length + appendBuff.length);
        pcbDataBuffer.set(u8buffer, 0);
        pcbDataBuffer.set(appendBuff, u8buffer.length);

    }else {
        pcbDataBuffer = new Uint8Array(u8buffer.buffer)
    }

    if (wDataSize == 78) {
        for (var i = 0; i < pcbDataBuffer.length; i++){
            cc.log(" old data == ", i, pcbDataBuffer[i])
        }
    }
    var newsize = 0
    var cbCheckCode = 0
    for (var i = TCP_INFO_SIZE; i < wDataSize; i++)
    {
        pcbDataBuffer[i] += 28;
        pcbDataBuffer[i] += 100;
        cbCheckCode += pcbDataBuffer[i];
        pcbDataBuffer[i] = this.MapSendByte(pcbDataBuffer[i]);
    }
    cbCheckCode = cbCheckCode & 0xFF
    cbCheckCode = (~cbCheckCode + 1) &0xFF
    // 创建密钥
    var  dwXorKey = this.m_dwSendXorKey;
    if (this.m_dwSendPacketCount == 0)
    {
        // 生成第一次随机种子
        var data0 = rand();
        var data1 = rand();
        var data2 = rand();
        var data3 = rand();
        var data4 = rand();
        dwXorKey = data0;
        dwXorKey ^= data1;
        dwXorKey ^= data2;
        dwXorKey ^= data3;
        dwXorKey ^= data4;
        dwXorKey = 0
        // 随机映射种子
        dwXorKey = (this.SeedRandMap((dwXorKey>>16) & WOFR_MASK)) <<16;
        dwXorKey |= this.SeedRandMap(dwXorKey  & WOFR_MASK );
        dwXorKey ^= PACKET_KEY;
        dwXorKey = dwXorKey >>> 0;
        this.m_dwSendXorKey = dwXorKey;
        this.m_dwRecvXorKey = dwXorKey;
    }

    if (wDataSize == 78) {
        for (var i = 0; i < pcbDataBuffer.length; i++){
            cc.log(" center data == ", i, pcbDataBuffer[i])
        }
    }
    // 加密数据
    var pwSeed = new Uint16Array(pcbDataBuffer.buffer);
    var pdwXor = new Uint32Array(pcbDataBuffer.buffer);
    var  wEncrypCount = pdwXor.length ; // 1 is tcp_info
    cc.log("####################### count= %d", wEncrypCount, dwXorKey);
    var pwSeedIdx = 2
    for (var i = 1; i < wEncrypCount; i++)
    {
        pdwXor[i] =  (pdwXor[i] ^ dwXorKey)  >>> 0;
        dwXorKey=this.SeedRandMap(pwSeed[pwSeedIdx]);
        pwSeedIdx++
        dwXorKey|=this.SeedRandMap(pwSeed[pwSeedIdx])<<16;
        dwXorKey = dwXorKey >>> 0
        pwSeedIdx++
        dwXorKey^= PACKET_KEY ;
        dwXorKey =  dwXorKey >>> 0
    }

    var XorKeyBuff
    var dwRecvXorKey = new Uint32Array([this.m_dwRecvXorKey])
    var u8dwRecvXorKey = new Uint8Array(dwRecvXorKey.buffer)
    // 插入密钥
    if (this.m_dwSendPacketCount == 0)
    {
        XorKeyBuff = new Uint8Array(wDataSize + 4)
        var oldIdx = 0;
        for (var j = 0; j < XorKeyBuff.length; j++)
        {
            if (j == 8){
                XorKeyBuff[j] =u8dwRecvXorKey[0]
                continue
            }else if (j == 9){
                XorKeyBuff[j] = u8dwRecvXorKey[1]
                continue
            }else if (j == 10){
                XorKeyBuff[j] =  u8dwRecvXorKey[2]
                continue
            }else if (j == 11){
                XorKeyBuff[j] =  u8dwRecvXorKey[3]
                continue
            }
            XorKeyBuff[j] = pcbDataBuffer[oldIdx]
            oldIdx++
        }
        newsize = wDataSize + 4;
    }

    if (wDataSize == 78) {
        for (var i = 0; i < pcbDataBuffer.length; i++){
            cc.log(" new data == ", i, pcbDataBuffer[i])
        }
    }

    // 设置变量
    this.m_dwSendPacketCount++;
    this.m_dwSendXorKey = dwXorKey;
    if (newsize != 0 && XorKeyBuff != null) {
        dv = new DataView(XorKeyBuff.buffer.slice(0, newsize))
        dv.setUint8(1,cbCheckCode, isLittleEndian)
        dv.setUint16(2, newsize, isLittleEndian)
        return  dv.buffer
    }

    dv = new DataView(pcbDataBuffer.buffer.slice(0, wDataSize))
    dv.setUint8(1,cbCheckCode, isLittleEndian)
    return  dv.buffer
}

// 接收一个 uint8buffer,
msgParse.prototype.CrevasseBuffer =function (u8buffer, wDataSize, cbCheckCode) {
    cc.log("at CrevasseBuffer wDataSize = ", wDataSize)
    var wSnapCount = 0;
    var pcbDataBuffer
    if (wDataSize % 4 != 0 ){
        wSnapCount = 4 - wDataSize % 4
        var appendBuff =  new Uint8Array(wSnapCount)
        pcbDataBuffer = new (u8buffer.constructor)(u8buffer.length + appendBuff.length);
        pcbDataBuffer.set(u8buffer, 0);
        pcbDataBuffer.set(appendBuff, u8buffer.length);
    }else {
        pcbDataBuffer = new Uint8Array(u8buffer.buffer)
    }

    if (cbCheckCode == 255){
        for(i =0; i < u8buffer.length; i++){
            cc.log(" u8buffer", i, u8buffer[i])
        }
    }

    // 解密数据
    var dwXorKey = this.m_dwRecvXorKey;
    var pwSeed = new Uint16Array(pcbDataBuffer.buffer);
    var pdwXor = new Uint32Array(pcbDataBuffer.buffer);
    var  wEncrypCount = pdwXor.length ; // 1 is tcp_info
    var pwSeedIdx = 2
    for (var i = 1; i < wEncrypCount; i++)
    {
        if (i == (wEncrypCount - 1) && (wSnapCount > 0))
        {
            var u32Buffer = new Uint32Array([this.m_dwRecvXorKey])
            var u8buffer = new Uint8Array(u32Buffer.buffer)
            cc.log(" for i == ", i, wEncrypCount)
            switch (wSnapCount){
                case 1:
                    cc.log(" i ==== ", i*4)
                    pcbDataBuffer[i*4 + 3] = u8buffer[3]
                    break
                case 2:
                    cc.log(" i ==== 11 ",i*4)
                    pcbDataBuffer[i*4 + 3] = u8buffer[3]
                    pcbDataBuffer[i*4+ 2] = u8buffer[2]
                    break
                case 3:
                    cc.log(" i ==== 22 ",i*4)
                    pcbDataBuffer[i*4 + 3] = u8buffer[3]
                    pcbDataBuffer[i*4 + 2] = u8buffer[2]
                    pcbDataBuffer[i*4 + 1] = u8buffer[1]
                    break
            }
        }

        dwXorKey=this.SeedRandMap(pwSeed[pwSeedIdx]);
        pwSeedIdx++;
        dwXorKey|= this.SeedRandMap(pwSeed[pwSeedIdx])<<16;
        dwXorKey = dwXorKey >>> 0
        pwSeedIdx++;
        dwXorKey^= PACKET_KEY;
        dwXorKey =  dwXorKey >>> 0
        pdwXor[i] =  (pdwXor[i] ^ this.m_dwRecvXorKey)  >>> 0;
        this.m_dwRecvXorKey=dwXorKey;
    }

    // 效验码与字节映射
    var testCheckCode = cbCheckCode
    cc.log("cbCheckCode === ", cbCheckCode)
    for (var i = 4; i < wDataSize; i++)
    {
        if (testCheckCode == 255){
            cc.log("befer == ", i,  pcbDataBuffer[i])
        }
        //cc.log("befer == ", i,  pcbDataBuffer[i])
        pcbDataBuffer[i] = this.MapRecvByte(pcbDataBuffer[i]);
        if (testCheckCode == 255){
            cc.log("afert == ", i, pcbDataBuffer[i])
        }
        //cc.log("afert == ", i, pcbDataBuffer[i])
        cbCheckCode += pcbDataBuffer[i];
        cbCheckCode = cbCheckCode & 0xFF
        pcbDataBuffer[i] -= 12;
        pcbDataBuffer[i] -= 116;
    }
    cbCheckCode = cbCheckCode & 0xFF
    if (cbCheckCode != 0){
        cc.log(" checkcode error  === ", cbCheckCode)
        return null;//throw TEXT("数据包效验码错误");
    }

    return new Uint8Array(pcbDataBuffer.buffer, 0, wDataSize);
}

msgParse.prototype.MapSendByte =function(bv){
    var r = bv + this.m_cbSendRound
    this.m_cbSendRound += 3
    r = r & BYTE_MASK
    this.m_cbSendRound =  this.m_cbSendRound & BYTE_MASK
    return g_SendByteMap[r]
}

msgParse.prototype.MapRecvByte = function (bv) {
    var v = (g_RecvByteMap[bv] - this.m_cbRecvRound) &BYTE_MASK
    this.m_cbRecvRound += 3
    this.m_cbRecvRound = this.m_cbRecvRound & BYTE_MASK
    return v
}

msgParse.prototype.SeedRandMap = function(wSeed) {
    var dwHold = wSeed;
    dwHold = ((dwHold * 241103)  & DWORD_MASK) >>>0
    dwHold = ((dwHold + 2533101)  & DWORD_MASK) >>> 0
    return ((dwHold >>16)&0xFFFF);
}

msgParse.prototype.ReSet = function () {
    this.m_cbSendRound = 0;
    this.m_cbRecvRound = 0;
    this.m_dwSendXorKey = rand();
    this.m_dwRecvXorKey = this.m_dwSendXorKey;


    this.m_dwSendTickCount = 0;
    this.m_dwRecvTickCount = 0;
    this.m_dwSendPacketCount = 0;
    this. m_dwRecvPacketCount = 0;
}


function rand() {
    return GetRandomNum(0,2147483647)
}

function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}