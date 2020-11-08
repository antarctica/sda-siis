"""
This is the layerdef module and supports all the REST actions for the
layerdef data
"""

from flask import make_response, abort
from config import db
from models import KeyValue, KeyValueSchema


def read_all():
    """
    This function responds to a request for /api/kv
    with the complete lists of KeyValue

    :return:        json string of list of all key/values
    """
    # Create the list of KVs from our data
    
    keyvalue = KeyValue.query.order_by(KeyValue.k).all()

    # Serialize the data for the response
    keyvalue_schema = KeyValueSchema(many=True)
    data = keyvalue_schema.dump(keyvalue)
    return data

def delete_all():
    """
    This function responds to a DELETE request for /api/kv

    :return:        204 - all KV pairs deleted  
    """
    db.session.query(KeyValue).delete()
    db.session.commit()


def read_one(key):
    """
    This function responds to a request for /api/kv/{key}
    with one matching key/value pair

    :param key:   key
    :return:      200 - matching KV pair
                  404 - Key not found
    """
    # Get the KV pair requested
    keyvalue = KeyValue.query.filter(KeyValue.k == key).one_or_none()

    # Did we find a key?
    if keyvalue is not None:

        # Serialize the data for the response
        keyvalue_schema = KeyValueSchema()
        data = keyvalue_schema.dump(keyvalue)
        return data

    # Otherwise, nope, didn't find that layer
    else:
        abort(
            404,
            "KV pair not found for Key: {key}".format(key=key),
        )

def delete_one(key):
    """
    This function responds to a DELETE request for /api/kv/{key}

    :return:        204 - KV pair deleted
                    404 - Key not found

    """
    keyvalue = KeyValue.query.filter(KeyValue.k == key).one_or_none()

    # Did we find the key?
    if keyvalue is not None:
        db.session.delete(keyvalue)
        db.session.commit()
        return make_response(
            "KV pair for key {key} deleted".format(key=key), 204
        )

    # Otherwise, nope, didn't find that key
    else:
        abort(
            404,
            "KV pair not found for Key: {key}".format(key=key),
        )

def update_one(key, kvdata):
    """
    This function responds to a PUT request for /api/kv/{key}
    updating a KV pair

    :return:        200 - KV pair updated
                    404 - Request error - Key not existing

    """
    # Get the KVpair requested from the db into session
    update_kv = KeyValue.query.filter(
        KeyValue.k == key
    ).one_or_none()

    # Try to find an existing person with the same name as the update
    # fname = person.get("fname")
    # lname = person.get("lname")

    # existing_person = (
    #     Person.query.filter(Person.fname == fname)
    #     .filter(Person.lname == lname)
    #     .one_or_none()
    # )

    # Are we trying to find a kvpair that does not exist?
    if update_kv is None:
        abort(
            404,
            "KV pair not found for key: {key}".format(key=key),
        )

    # Otherwise go ahead and update!
    else:

        # turn the passed in person into a db object
        schema = KeyValueSchema()
        kvdata2 = {"k": kvdata['key'], "v": kvdata['value']}
        print (kvdata, kvdata2)
        update = schema.load(kvdata2, session=db.session)

        # Set the id to the person we want to update
        update.k = update_kv.k

        # merge the new object into the old and commit it to the db
        db.session.merge(update)
        db.session.commit()

        # return updated person in the response
        data = schema.dump(update_kv)

        return data, 200




def create_one(key, kvdata):
    """
    This function responds to a POST request for /api/kv/{key}
    creating a new KV pair

    :return:        201 - KV pair created
                    400 - Request error - Key already exists

    """

    data_key = kvdata['key']
    data_value = kvdata['value']    

    # Check if key and data object's key are identical
    if key != data_key:
        abort(
            400,
            "Key {keydata} does not match key: {key}".format(keydata=data_key, key=key),

        )
    
    # Check if key exists
    existing_keyvalue = (
        KeyValue.query.filter(KeyValue.k == data_key)
        .one_or_none()
    )

    # Can we insert this kv pair?
    if existing_keyvalue is None:
        schema = KeyValueSchema()
        kvdata2 = {"k": kvdata['key'], "v": kvdata['value']}
        update = schema.load(kvdata2, session=db.session)

        db.session.add(update)
        db.session.commit()

        return kvdata, 201        


    # Otherwise, nope, kv already exists
    else:
        abort(
            400,
            "Key {key} already exists".format(key=key),
        )

