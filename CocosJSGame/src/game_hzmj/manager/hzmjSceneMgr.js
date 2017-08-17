/*
 * 红中麻将场景管理
 * Author: 	xjn 
 * Date:	2017.4.8
 * 
 * 功能：
 * 交互操作
 * */

var HzmjSceneMgr = cc.Class.extend({
    ctor: function () {
    },

    //生成场景鱼
    BuildSceneFish: function(sceneKind, rootNode, elasped) {
        switch(sceneKind){
            case CMD_HZMJ.SCENE_KIND_1:
                this.BuildSceneFish2(rootNode, elasped);
                break;
            case CMD_HZMJ.SCENE_KIND_2:
                this.BuildSceneFish5(rootNode, elasped);
                break;
            case CMD_HZMJ.SCENE_KIND_3:
                this.BuildSceneFish3(rootNode, elasped);
                break;
            case CMD_HZMJ.SCENE_KIND_4:
                this.BuildSceneFish1(rootNode, elasped);
                break;
            case CMD_HZMJ.SCENE_KIND_5:
                this.BuildSceneFish4(rootNode, elasped);
                break;
        }
    },

    //生成场景鱼1
    BuildSceneFish1: function(rootNode, elasped) {
        var kScreenWidth = CMD_HZMJ.kScreenWidth
        var kScreenHeight = CMD_HZMJ.kScreenHeight;
        var i, fish;
        var kFishSpeed = 60;
        var kBenchmarkPos = cc.p(520, kScreenHeight / 2);
        var center1 = cc.p(0-kBenchmarkPos.x, kBenchmarkPos.y);
        var center2 = cc.p(kScreenWidth + kBenchmarkPos.x, kBenchmarkPos.y);
        var fish_id = 0;
        var fish_kind = 0;
        var x0,y0,x1,y1;
        var action = null;

        // 中心2条大鱼 银龙和金龙
        fish_id = 0;
        fish_kind = CMD_HZMJ.FISH_SWK;
        x0 = 0-kBenchmarkPos.x;
        y0 = kBenchmarkPos.y;
        x1 = kScreenWidth + kBenchmarkPos.x;
        y1 = kBenchmarkPos.y;
        
        fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id, 0);
        if(fish){
            rootNode.addChild(fish);
            action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
            fish.playFishMove(action, elasped);
        }

        fish_id = 1;
        fish_kind = CMD_HZMJ.FISH_YUWANGDADI;
        x0 = kScreenWidth + kBenchmarkPos.x;
        y0 = kBenchmarkPos.y;
        x1 = 0-kBenchmarkPos.x;
        y1 = kBenchmarkPos.y;
        
        fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id, 0);
        if(fish){
            rootNode.addChild(fish);
            action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
            fish.playFishMove(action, elasped);
        }

        // 第1环左边
        fish_id = 2;
        fish_kind = CMD_HZMJ.FISH_XIAOCHOUYU;
        var radius = 185;
        var cell_radian = 2 * Math.PI / 25;
        for (i=0; i<25; ++i) {
            x0 = center1.x + radius * Math.cos(i * cell_radian);
            y0 = center1.y + radius * Math.sin(i * cell_radian);
            x1 = x0 + kScreenWidth + kBenchmarkPos.x * 2;
            y1 = y0;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }

        // 第1环右边
        fish_id += 25;
        fish_kind = CMD_HZMJ.FISH_HUANGBIANYU;
        radius = 195;
        for (i=0; i<25; ++i) {
            x0 = center2.x + radius * Math.cos(i * cell_radian);
            y0 = center2.y + radius * Math.sin(i * cell_radian);
            x1 =  x0 - kScreenWidth - kBenchmarkPos.x * 2;
            y1 = y0;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }

        // 第2环左边
        fish_id += 25;
        fish_kind = CMD_HZMJ.FISH_DAYANYU;
        radius = 287;
        cell_radian = 2 * Math.PI / 30;
        for (i=0; i<30; ++i) {
            x0 = center1.x + radius * Math.cos(i * cell_radian);
            y0 = center1.y + radius * Math.sin(i * cell_radian);
            x1 = x0 + kScreenWidth + kBenchmarkPos.x * 2;
            y1 = y0;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }

        // 第2环右边
        fish_id += 30;
        fish_kind = CMD_HZMJ.FISH_HUANGCAOYU;
        radius = 296;
        cell_radian = 2 * Math.PI / 30;
        for (i=0; i<30; ++i) {
            x0 = center2.x + radius * Math.cos(i * cell_radian);
            y0 = center2.y + radius * Math.sin(i * cell_radian);
            x1 =  x0 - kScreenWidth - kBenchmarkPos.x * 2;
            y1 = y0;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }

        // 第3环左边
        fish_id += 30;
        fish_kind = CMD_HZMJ.FISH_LVCAOYU;
        radius = 363;
        cell_radian = 2 * Math.PI / 35;
        for (i=0; i<35; ++i) {
            x0 = center1.x + radius * Math.cos(i * cell_radian);
            y0 = center1.y + radius * Math.sin(i * cell_radian);
            x1 = x0 + kScreenWidth + kBenchmarkPos.x * 2;
            y1 = y0;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }

        // 第3环右边
        fish_id += 35;
        fish_kind = CMD_HZMJ.FISH_HUANGBIANYU;
        radius = 370;
        cell_radian = 2 * Math.PI / 35;
        for (i=0; i<35; ++i) {
            x0 = center2.x + radius * Math.cos(i * cell_radian);
            y0 = center2.y + radius * Math.sin(i * cell_radian);
            x1 =  x0 - kScreenWidth - kBenchmarkPos.x * 2;
            y1 = y0;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
    },

    //生成场景鱼2
    BuildSceneFish2: function(rootNode, elasped) {
        var i, fish;
        var kFishSpeed = 60;
        var fish_id = 0;
        var fish_kind = 0;
        var x0,y0,x1,y1;
        var kOffset = 100;
        var sub_offset = 0;
        var kScreenWidth = CMD_HZMJ.kScreenWidth
        var kScreenHeight = CMD_HZMJ.kScreenHeight;
        var action = null;

        // 绿草鱼 16 * 4 // 200
        sub_offset = 168;
        fish_kind = CMD_HZMJ.FISH_LVCAOYU;
        for(i=0; i<16; i++){
            y1 = y0 = 150 + 12;
            x1 = kScreenWidth + 60;
            x0 = 0 - kOffset - sub_offset - i * 54;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 16;
        for(i=0; i<16; i++){
            y1 = y0 = 150 + 12 + 100;
            x1 = kScreenWidth + 60;
            x0 = 0 - kOffset - sub_offset - i * 54;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 16;
        for(i=0; i<16; i++){
            y1 = y0 = kScreenHeight - 150 - 100;
            x1 = kScreenWidth + 60;
            x0 = 0 - kOffset - sub_offset - i * 54;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 16;
        for(i=0; i<16; i++){
            y1 = y0 = kScreenHeight - 150;
            x1 = kScreenWidth + 60;
            x0 = 0 - kOffset - sub_offset - i * 54;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 16;

        // 小刺鱼 10 + 10 + 3 + 3
        fish_kind = CMD_HZMJ.FISH_XIAOCIYU;
        for (i=0; i<10; i++) {
            y1 = y0 = 150 + 12 + 50;
            x1 = kScreenWidth + 150;
            x0 = -kOffset - i * 120;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 10;
        for (i=0; i<10; i++) {
            y1 = y0 = kScreenHeight - 150 - 50;
            x1 = kScreenWidth + 150;
            x0 = -kOffset - i * 120;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 10;
        for (i=0; i<3; i++) {
            y1 = y0 = 150 + 12 + 50 + (i + 1) * 100;
            x1 = kScreenWidth + 150;
            x0 = -kOffset;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 3;
        for (i=0; i<3; i++) {
            y1 = y0 = 150 + 12 + 50 + (i + 1) * 100;
            x1 = kScreenWidth + 150;
            x0 = -kOffset - 9 * 120;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 3;

        // 大闹天宫 绿草鱼和小刺鱼
        fish_kind = CMD_HZMJ.FISH_DNTG;
        y1 = y0 = 150 + 12;
        x1 = kScreenWidth + 150;
        x0 = 0 - kOffset - 256;
        
        fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id, CMD_HZMJ.FISH_LVCAOYU);
        if(fish){
            rootNode.addChild(fish);
            action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
            fish.playFishMove(action, elasped);
        }
        ++fish_id;
        y1 = y0 = 150 + 40;
        x1 = kScreenWidth + 150;
        x0 = 0 - kOffset - 128;
        
        fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id, CMD_HZMJ.FISH_XIAOCIYU);
        if(fish){
            rootNode.addChild(fish);
            action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
            fish.playFishMove(action, elasped);
        }
        ++fish_id;

        // 大眼鱼 4 + 4
        fish_kind = CMD_HZMJ.FISH_DAYANYU;
        var center = cc.p(0 - kOffset - sub_offset - 2 * 54, 150 + 12 + 50 + 165);
        var radius = 50;
        var angle = 0;
        for (i = 0; i<4; ++i) {
            x0 = center.x + radius * Math.cos(angle);
            y0 = center.y + radius * Math.sin(angle);
            x1 =  kScreenWidth + 150;
            y1 = y0;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
            angle += (Math.PI / 2);
        }
        fish_id += 4;
        center.x = -kOffset - sub_offset - 13 * 54;
        angle = 0;
        for (i=0; i<4; ++i) {
            x0 = center.x + radius * Math.cos(angle);
            y0 = center.y + radius * Math.sin(angle);
            x1 =  kScreenWidth + 150;
            y1 = y0;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
            angle += (Math.PI / 2);
        }
        fish_id += 4;

        // 悟空
        fish_kind = CMD_HZMJ.FISH_SWK;
        y1 = y0 = kScreenHeight - 150 - 100;
        x1 = kScreenWidth + 380;
        x0 = -kOffset - 620;
        
        fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id, 0);
        if(fish){
            rootNode.addChild(fish);
            action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
            fish.playFishMove(action, elasped);
        }
        ++fish_id;
    },

    //生成场景鱼3
    BuildSceneFish3: function(rootNode, elasped) {
        var heroChairId = g_objHero.getChairID();

        var kScreenWidth = CMD_HZMJ.kScreenWidth
        var kScreenHeight = CMD_HZMJ.kScreenHeight;
        var i, fish;
        var kFishSpeed = 150;
        var fish_id = 0;
        var fish_kind = 0;
        var center = cc.p(kScreenWidth / 2, kScreenHeight / 2);
        var radius = 0;
        var cell_radian = 0;
        var angle = 0;
        var action = null;

        // 玉皇大帝
        fish_kind = CMD_HZMJ.FISH_YUWANGDADI;
        fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id, 0);
        if(fish){
            rootNode.addChild(fish);
            action = new gg.DntgActionScene3(fish, center, 0, 28, heroChairId < 3 ? 180 : 0, 4 * 180 + 90, 5, kFishSpeed);
            fish.playFishMove(action, elasped);
        }
        ++fish_id;

        // 小丑鱼
        fish_kind = CMD_HZMJ.FISH_XIAOCHOUYU;
        radius = 150;
        cell_radian = 2 * 180 / 10;
        for (i=0; i<10; ++i) {
            angle = i * cell_radian;
            if (heroChairId < 3){
                angle += 180;
            }
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionScene3(fish, center, radius, 27, angle, 4 * 180, 5, kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 10;

        // 大眼鱼
        fish_kind = CMD_HZMJ.FISH_DAYANYU;
        radius = 150 + 52 + 42;
        cell_radian = 2 * 180 / 18;
        for (i=0; i<18; ++i) {
            angle = i * cell_radian;
            if (heroChairId < 3){
                angle += 180;
            }
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionScene3(fish, center, radius, 26, angle, 4 * 180 - 90, 5, kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 18;

        // 黄草鱼
        fish_kind = CMD_HZMJ.FISH_HUANGCAOYU;
        radius = 150 + 52 + 42 * 2 + 30;
        cell_radian = 2 * 180 / 30;
        for (i=0; i<30; ++i) {
            angle = i * cell_radian;
            if (heroChairId < 3){
                angle += 180;
            }
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionScene3(fish, center, radius, 25, angle, 4 * 180 - 90 * 2, 5, kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 30;

        // 蜗牛鱼
        fish_kind = CMD_HZMJ.FISH_WONIUYU;
        radius = 150 + 52 + 42 * 2 + 30 * 2 + 35;
        cell_radian = 2 * 180 / 30;
        for (i=0; i<30; ++i) {
            angle = i * cell_radian;
            if (heroChairId < 3){
                angle += 180;
            }
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionScene3(fish, center, radius, 24, angle, 4 * 180 - 90 * 3, 5, kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 30;
    },

    //生成场景鱼4
    BuildSceneFish4: function(rootNode, elasped) {
        var heroChairId = g_objHero.getChairID();

        var kScreenWidth = CMD_HZMJ.kScreenWidth
        var kScreenHeight = CMD_HZMJ.kScreenHeight;
        var i, fish;
        var kFishSpeed = 150;
        var fish_id = 0;
        var fish_kind = 0;
        var center = cc.p(kScreenWidth / 2, kScreenHeight / 2);
        var radius = 0;
        var cell_radian = 0;
        var angle = 0;
        var action = null;

        // 孙悟空
        fish_kind = CMD_HZMJ.FISH_SWK;
        fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id, 0);
        if(fish){
            rootNode.addChild(fish);
            action = new gg.DntgActionScene4(fish, center, 0, 28, heroChairId < 3 ? 180 : 0, 4 * 180 + 90, 5, kFishSpeed);
            fish.playFishMove(action, elasped);
        }
        ++fish_id;

        // 小丑鱼
        fish_kind = CMD_HZMJ.FISH_XIAOCHOUYU;
        radius = 150;
        cell_radian = 2 * 180 / 10;
        for (i=0; i<10; ++i) {
            angle = i * cell_radian;
            if (heroChairId < 3){
                angle += 180;
            }
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionScene4(fish, center, radius, 27, angle, 4 * 180, 5, kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 10;

        // 大眼鱼
        fish_kind = CMD_HZMJ.FISH_DAYANYU;
        radius = 150 + 52 + 42;
        cell_radian = 2 * 180 / 18;
        for (i=0; i<18; ++i) {
            angle = i * cell_radian;
            if (heroChairId < 3){
                angle += 180;
            }
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionScene4(fish, center, radius, 26, angle, 4 * 180 - 90, 5, kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 18;

        // 黄草鱼
        fish_kind = CMD_HZMJ.FISH_HUANGCAOYU;
        radius = 150 + 52 + 42 * 2 + 30;
        cell_radian = 2 * 180 / 30;
        for (i=0; i<30; ++i) {
            angle = i * cell_radian;
            if (heroChairId < 3){
                angle += 180;
            }
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionScene4(fish, center, radius, 25, angle, 4 * 180 - 90 * 2, 5, kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 30;

        // 蜗牛鱼
        fish_kind = CMD_HZMJ.FISH_WONIUYU;
        radius = 150 + 52 + 42 * 2 + 30 * 2 + 35;
        cell_radian = 2 * 180 / 30;
        for (i=0; i<30; ++i) {
            angle = i * cell_radian;
            if (heroChairId < 3){
                angle += 180;
            }
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionScene4(fish, center, radius, 24, angle, 4 * 180 - 90 * 3, 5, kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 30;
    },

    //生成场景鱼5
    BuildSceneFish5: function(rootNode, elasped) {
        var i, fish;
        var kFishSpeed = 50;
        var fish_id = 0;
        var fish_kind = 0;
        var x0,y0,x1,y1;
        var kScreenWidth = CMD_HZMJ.kScreenWidth
        var kScreenHeight = CMD_HZMJ.kScreenHeight;
        var action = null;

        // 蜗牛鱼 上50 下50
        var hinterval =  kScreenWidth / 13;
        var vinterval = kScreenHeight / 6;
        fish_kind = CMD_HZMJ.FISH_WONIUYU;
        for (i=0; i<50; ++i) {
            x0 = hinterval + (hinterval + (hinterval / 5)) * (i % 10);
            y0 = -100 - (i / 10) * vinterval - (i % 3) * vinterval / 5;
            x1 = x0;
            y1 = kScreenHeight + 100;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 50;
        for (i=0; i<50; ++i) {
            x0 = hinterval + (hinterval + (hinterval / 5)) * (i % 10) + hinterval / 2;
            y0 = kScreenHeight + 100 + 4 * vinterval - (i / 10) * vinterval + (i % 3) * vinterval / 5;
            x1 = x0;
            y1 = -100;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 50;

        // 蝙蝠鱼 银鲨 金鲨
        kFishSpeed = 100;
        fish_kind = CMD_HZMJ.FISH_BIANFUYU;
        var kFishStart1 = [
            cc.p(kScreenWidth + 200, kScreenHeight / 2),
            cc.p(kScreenWidth + 500, kScreenHeight / 2 - 50),
            cc.p(kScreenWidth + 800, kScreenHeight / 2 + 60),
            cc.p(kScreenWidth + 1100, kScreenHeight / 2 - 60),
            cc.p(kScreenWidth + 1400, kScreenHeight / 2 - 60)
        ];
        var kFishEnd1 = [
            cc.p(-200, kScreenHeight / 2),
            cc.p(-200, kScreenHeight / 2 - 100),
            cc.p(-200, kScreenHeight / 2 + 100),
            cc.p(-200, kScreenHeight / 2 + 60),
            cc.p(-200, kScreenHeight / 2 - 60)
        ];
        for (i=0; i<5; ++i) {
            x0 = kFishStart1[i].x;
            y0 = kFishStart1[i].y;
            x1 = kFishEnd1[i].x;
            y1 = kFishEnd1[i].y;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 5;
        fish_kind = CMD_HZMJ.FISH_YINSHA;
        var kFishStart2 = [
            cc.p(kScreenWidth + 200, kScreenHeight / 2),
            cc.p(kScreenWidth + 500, kScreenHeight / 2 - 50),
            cc.p(kScreenWidth + 800, kScreenHeight / 2 + 60),
            cc.p(kScreenWidth + 1100, kScreenHeight / 2 - 60),
            cc.p(kScreenWidth + 1400, kScreenHeight / 2 - 60)
        ];
        var kFishEnd2 = [
            cc.p(-200, kScreenHeight - 100),
            cc.p(-300, kScreenHeight + 1),
            cc.p(-400, kScreenHeight + 100),
            cc.p(-500, kScreenHeight + 60),
            cc.p(-600, kScreenHeight - 60)
        ];
        for (i=0; i<5; ++i) {
            x0 = kFishStart2[i].x;
            y0 = kFishStart2[i].y;
            x1 = kFishEnd2[i].x;
            y1 = kFishEnd2[i].y;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 5;
        fish_kind = CMD_HZMJ.FISH_JINSHA;
        var kFishStart3 = [
            cc.p(kScreenWidth + 200, kScreenHeight / 2),
            cc.p(kScreenWidth + 500, kScreenHeight / 2 - 50),
            cc.p(kScreenWidth + 800, kScreenHeight / 2 + 60),
            cc.p(kScreenWidth + 1100, kScreenHeight / 2 - 60),
            cc.p(kScreenWidth + 1400, kScreenHeight / 2 - 60)
        ];
        var kFishEnd3 = [
            cc.p(-200, 100),
            cc.p(-300, 0),
            cc.p(-400, -100),
            cc.p(-500, -60),
            cc.p(-600, 60)
        ];
        for (i=0; i<5; ++i) {
            x0 = kFishStart3[i].x;
            y0 = kFishStart3[i].y;
            x1 = kFishEnd3[i].x;
            y1 = kFishEnd3[i].y;
            
            fish = DntgUIMgr.getInstance().createFishKind(fish_kind, fish_id+i, 0);
            if(fish){
                rootNode.addChild(fish);
                action = new gg.DntgActionLinear(fish, [cc.p(x0, y0), cc.p(x1, y1)], kFishSpeed);
                fish.playFishMove(action, elasped);
            }
        }
        fish_id += 5;
    },
});

var g_HzmjSceneMgr = null;

HzmjSceneMgr.getInstance = function() {
    if (!g_HzmjSceneMgr) {
        g_HzmjSceneMgr = new HzmjSceneMgr();
    }
    return g_HzmjSceneMgr;
};