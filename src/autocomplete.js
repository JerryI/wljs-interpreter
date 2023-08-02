window.EditorAutocomplete.extend([
    {
        "label":"FrontEndRef",
        "type":"keyword",
        "info":"[Frontend Only] FrontEndRef[\"uid\"], FrontEndRef[FrontEndExecutable[\"uid\"]] is a inactive reference to the frontend object, i.e. FrontEndExecutable"
    },
    {
        "label":"FHold",
        "type":"keyword",
        "info":"FHold[expr] hold expressing to evaluate purely on the frontend"
    },  
    {
        "label": "NoVirtual",
        "type": "keyword",
        "info": "Blocks dynamics and virtual containers"
    },
    {
        "label":"FrontEndOnly",
        "type":"keyword",
        "info":"a synonim to FHold"
    },    
    {
        "label":"FrontSubmit",
        "type":"keyword",
        "info":'Evaluate any expression using frontend (no reply). Or FrontSubmit[expr_, MetaMarker[""]] evaluates inside a specific marked container'
    }, 
    {
        "label":"CreateFrontEndObject",
        "type":"keyword",
        "info":"[Both] CreateFrontEndObject[expr, \"uid\"] define a sharable object"
    }, 
    {
        "label": "FrontEndVirtual",
        "type":"keyword",
        "info":"[Frontend Only] FrontEndVirtual[expr] executes a function in a virtual container"
    },     
    {
        "label":"MetaMarker",
        "type":"keyword",
        "info":"[Frontend Only] MetaMarker[\"uid\"] place a marker to a frontend object to be able to find its instance"
    },
    {
        "label": "FindMetaMarker",
        "type": "keyword",
        "info": "[Frontend Only] Allows to find an instace it of marked FrontEndObject"
    }, 
    {
        "label": "ConsoleLog",
        "type": "keyword",
        "info": "[Frontend Only] an array of errors occured"
    },   
    {
        "label": "_typeof",
        "type": "keyword",
        "info": "[Frontend Only] check the type of an entity"
    },   
    {
        "label": "_getRules",
        "type": "keyword",
        "info": "[Frontend Only] extract the list of rules"
    },   
    {
        "label": "FireEvent",
        "type": "keyword",
        "info": "[Frontend Only] fire an event with FireEvent[uid]"
    },
    {
        "label": "AskMaster",
        "type": "keyword",
        "info": "Evaluate any arbitary expression on the master kernel (not recommended)"
    },
    {
        "label": "SendToFrontEnd",
        "type": "keyword",
        "info": "an alias to FrontSubmit"
    },
    {
        "label": "EventBind",
        "type": "keyword",
        "info": "An alias to EventHandler[]. Bind a function to an EventObject."
    },
    {
        "label": "EventObject",
        "type": "keyword",
        "info": "An event object EventObject[<|\"id\"->, \"view\"|>]. If there is a field view, it automatically becomes FrontEndExecutable"
    },
    {
        "label": "EventsRack",
        "type": "keyword",
        "info": "EventsRack[list] of EventObjects. Make an union of many events objects into one"
    }, 
    {
        "label": "EventRemove",
        "type": "keyword",
        "info": "EventRemove[EventObject[]] removes the handler"
    },   
    {
        "label": "EventListener",
        "type": "keyword",
        "info": "[Frontend Only] Attach a event listener to an object"
    },       
    {
        "label": "SetFrontEndObject",
        "type": "keyword",
        "info": "[Frontend Only] SetFrontEndObject[uid, data] Assign a new value to frontend object with name"  
    },
    {
        "label": "FlipSymbols",
        "type": "keyword",
        "info": "[Frontend Only] FlipSymbols[symbol1, symbol2] flip two frontend object and fires update method on each"          
    },
    {
        "label": "Alert",
        "type": "keyword",
        "info": "[Frontend Only] Alert[message] make a popup window with a message provided"          
    },

    {
        "label": "AttachDOM",
        "type": "keyword",
        "info": "[Frontend Only] AttachDOM[DOMid] attach the DOM id to the context"          
    }
    

])

console.log('loaded!');