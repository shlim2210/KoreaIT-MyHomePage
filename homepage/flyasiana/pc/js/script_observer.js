var targetUAs = ['micromessenger','miniprogram']; //MicroMessenger = WeChat Mini program, miniprogram = WeChat Dev Tool
var blockedDomains = ['criteo.com', 'criteo.net', 'yahoo.com', 'google.com', 'google.co.kr', 'facebook.com', 'facebook.net', 'google-analytics.com', 'googletagmanager.com', 'code.nytive.com', 'gstatic.com', 'googleapis.com', 'youtube.com', 'eba-amadeus.netdna-ssl.com'];

const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach(node => {            
            check(node);            
        })
    })
})

const check = node => {
    if(node.nodeType == 1 && ( node.tagName == 'SCRIPT' || node.tagName == 'IFRAME' )) {

        blockedDomains.forEach( item => { 

            if(node.src.indexOf(item) > 0){
                node.parentNode.removeChild(node);
            } 
        }); 
    }

    if(node.nodeName == "#text"){
        blockedDomains.forEach( item => { 
            if(node.data.indexOf(item) > 0){
                node.data = replaceAll(node.data, item, 'flyasiana.com');
            } 
        }); 
    }
}

//check ua string and run observer 
targetUAs.forEach(ua => {
    if(navigator.userAgent.toLowerCase().indexOf(ua) > 0){
        // Starts the monitoring
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        return;
    }
});
   

function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
}
