function createPartialSaveObject(episode, collectionName, data) {
    var jsonObj = null;
    jsonObj = {
        Episode: episode,
        Section: collectionName,
        JsonData: JSON.stringify(data)
    };

    return jsonObj;
}


async function SendPartialSavedData(url, data, method, dataType) {
    var r = false;
    var result = await $.ajax({
        url: url,
        type: method,
        dataType: dataType,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (d) {
            r = true;
            return true;
        },
        error: function (err) {
            console.log(method + "ERROR codigo( " + err.status + "): " + err.statusText);
            r = false;
            return false;
        }
    });

    return r;
}

async function SendPartialSavedData2(data, method, dataType) {
    var url = '/PartialSave/';

    switch (method) {
        case 'POST':
            url = url + 'Create';
            break;
        case 'PUT':
            url = url + 'Update/' + data.Episode;
            break;
        default:
    }

    var r = false;
    var result = await $.ajax({
        url: url,
        type: method,
        dataType: dataType,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (d) {
            r = true;
            return true;
        },
        error: function (err) {
            console.log(method + "ERROR codigo( " + err.status + "): " + err.statusText);
            r = false;
            return false;
        }
    });

    return r;
}
