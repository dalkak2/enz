init({objects:[{id:'7y0y',name:'엔트리봇',objectType:'sprite',rotateMethod:'free',scene:'7dwq',sprite:{pictures:[{id:'vx80',dimension:{width:144,height:246},fileurl:'/lib/entry-js/images/media/entrybot1.svg',name:'엔트리봇_걷기1',imageType:'svg'},{id:'4t48',dimension:{width:144,height:246},fileurl:'/lib/entry-js/images/media/entrybot2.svg',name:'엔트리봇_걷기2',imageType:'svg'}],sounds:[{duration:1.3,ext:'.mp3',id:'8el5',fileurl:'/lib/entry-js/images/media/bark.mp3',name:'강아지 짖는 소리'}]},selectedPictureId:'vx80',lock:false,entity:{x:0,y:0,regX:72,regY:123,scaleX:0.5128205128205128,scaleY:0.5128205128205128,rotation:0,direction:90,width:144,height:246,font:'undefinedpx ',visible:true}}],scenes:[{id:'7dwq',name:'장면 1'}],variables:[{name:'초시계',id:'brih',visible:false,value:'0',variableType:'timer',isCloud:false,isRealTime:false,cloudDate:false,object:null,x:134,y:-70},{name:' 대답 ',id:'1vu8',visible:false,value:'0',variableType:'answer',isCloud:false,isRealTime:false,cloudDate:false,object:null,x:150,y:-100}],messages:[],functions:[{id:'j0wh',type:'normal',localVariables:[],useLocalVariables:false}],tables:[],speed:60,interface:{menuWidth:280,canvasWidth:480,object:'7y0y'},expansionBlocks:[],aiUtilizeBlocks:[],hardwareLiteBlocks:[],externalModules:[],externalModulesLite:[]})

Entry.func_j0wh = (stringParam_66j8, obj) => {Entry.dialog(stringParam_66j8, "speak", obj)}

Entry.when_run_button_click(() => {Entry.func_j0wh("123", "7y0y")}, "7y0y")