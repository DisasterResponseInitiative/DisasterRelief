
## Limitations

  - Primary keys should either be auto-increment (from 1 to 2^53) or UUID
  - Composite primary or foreign keys are not supported
  - Complex filters (with both "and" & "or") are not supported
  - Complex writes (transactions) are not supported
  - Complex queries calling functions (like "concat" or "sum") are not supported
  - MySQL storage engine must be either InnoDB or XtraDB
  - SQLite does not support binary and spatial/GIS functionality
  - MySQL BIT field type is not supported (use TINYINT)

## Features

  - Single PHP file, easy to deploy.
  - Very little code, easy to adapt and maintain
  - Streaming data, low memory footprint
  - Supports POST variables as input
  - Supports a JSON object as input
  - Supports a JSON array as input (batch insert)
  - Supports file upload from web forms (multipart/form-data)
  - Condensed JSON ouput: first row contains field names
  - Sanitize and validate input using callbacks
  - Permission system for databases, tables, columns and records
  - Multi-tenant database layouts are supported
  - Multi-domain CORS support for cross-domain requests
  - Combined requests with support for multiple table names
  - Search support on multiple criteria
  - Pagination, sorting and column selection
  - Relation detection and filtering on foreign keys
  - Relation "transforms" for PHP and JavaScript
  - Atomic increment support via PATCH (for counters)
  - Binary fields supported with base64 encoding
  - Spatial/GIS fields and filters supported with WKT
  - Unstructured data support through JSON/JSONB/XML
  - Generate API documentation using Swagger tools
  - Authentication via JWT token or username/password (via [PHP-API-AUTH](https://github.com/mevdschee/php-api-auth))



## Documentation

After configuring you can directly benefit from generated API documentation. On the URL below you find the generated API specification in [Swagger](http://swagger.io/) 2.0 format.

    http://dri.cloud.sushant.info.np/api.php

Try the [editor](http://editor.swagger.io/) to quickly view it! Choose "File" > "Paste JSON..." from the menu.

## Usage

You can do all CRUD (Create, Read, Update, Delete) operations and one extra List operation. Here is how:

### List

List all records of a database table.

```
GET http://dri.cloud.sushant.info.np/api.php/data
```

Output:

```
{"data":{"columns":["id","name"],"records":[[1,"Internet"],[3,"Web development"]]}}
```

### List + Transform

List all records of a database table and transform them to objects.

```
GET http://dri.cloud.sushant.info.np/api.php/data?transform=1
```

Output:

```
{"data":[{"id":1,"name":"Internet"},{"id":3,"name":"Web development"}]}
```

NB: This transform is CPU and memory intensive and can also be executed client-side (see: [lib](https://github.com/mevdschee/php-crud-api/tree/master/lib)).

### List + Filter

Search is implemented with the "filter" parameter. You need to specify the column name, a comma, the match type, another commma and the value you want to filter on. These are supported match types:

  - cs: contain string (string contains value)
  - sw: start with (string starts with value)
  - ew: end with (string end with value)
  - eq: equal (string or number matches exactly)
  - lt: lower than (number is lower than value)
  - le: lower or equal (number is lower than or equal to value)
  - ge: greater or equal (number is higher than or equal to value)
  - gt: greater than (number is higher than value)
  - bt: between (number is between two comma separated values)
  - in: in (number is in comma separated list of values)
  - is: is null (field contains "NULL" value)

You can negate all filters by prepending a 'n' character, so that 'eq' becomes 'neq'.

```
GET http://dri.cloud.sushant.info.np/api.php/data?filter=name,eq,Internet
GET http://dri.cloud.sushant.info.np/api.php/data?filter=name,sw,Inter
GET http://dri.cloud.sushant.info.np/api.php/data?filter=id,le,1
GET http://dri.cloud.sushant.info.np/api.php/data?filter=id,ngt,2
GET http://dri.cloud.sushant.info.np/api.php/data?filter=id,bt,1,1
GET http://dri.cloud.sushant.info.np/api.php/data?filter=data.id,eq,1
```

Output:

```
{"data":{"columns":["id","name"],"records":[[1,"Internet"]]}}
```

NB: You may specify table name before the field name, seperated with a dot.

### List + Filter + Satisfy

Multiple filters can be applied by using "filter[]" instead of "filter" as a parameter name. Then the parameter "satisfy" is used to indicate whether "all" (default) or "any" filter should be satisfied to lead to a match:

```
GET http://dri.cloud.sushant.info.np/api.php/data?filter[]=id,eq,1&filter[]=id,eq,3&satisfy=any
GET http://dri.cloud.sushant.info.np/api.php/data?filter[]=id,ge,1&filter[]=id,le,3&satisfy=all
GET http://dri.cloud.sushant.info.np/api.php/data?filter[]=id,ge,1&filter[]=id,le,3&satisfy=data.all
GET http://dri.cloud.sushant.info.np/api.php/data?filter[]=id,ge,1&filter[]=id,le,3
```

Output:

```
{"data":{"columns":["id","name"],"records":[[1,"Internet"],[3,"Web development"]]}}
```

NB: You may specify "satisfy=data.all,posts.any" if you want to mix "and" and "or" for different tables.

### List + Column selection

By default all columns are selected. With the "columns" parameter you can select specific columns. Multiple columns should be comma separated. 
An asterisk ("*") may be used as a wildcard to indicate "all columns". Similar to "columns" you may use the "exclude" parameter to remove certain columns:

```
GET http://dri.cloud.sushant.info.np/api.php/data?columns=name
GET http://dri.cloud.sushant.info.np/api.php/data?columns=data.name
GET http://dri.cloud.sushant.info.np/api.php/data?exclude=data.id
```

Output:

```
{"data":{"columns":["name"],"records":[["Web development"],["Internet"]]}}
```

NB: Columns that are used to include related entities are automatically added and cannot be left out of the output.

### List + Order

With the "order" parameter you can sort. By default the sort is in ascending order, but by specifying "desc" this can be reversed:

```
GET http://dri.cloud.sushant.info.np/api.php/data?order=name,desc
GET http://dri.cloud.sushant.info.np/api.php/posts?order[]=icon,desc&order[]=name
```

Output:

```
{"data":{"columns":["id","name"],"records":[[3,"Web development"],[1,"Internet"]]}}
```

NB: You may sort on multiple fields by using "order[]" instead of "order" as a parameter name.

### List + Order + Pagination

The "page" parameter holds the requested page. The default page size is 20, but can be adjusted (e.g. to 50):

```
GET http://dri.cloud.sushant.info.np/api.php/data?order=id&page=1
GET http://dri.cloud.sushant.info.np/api.php/data?order=id&page=1,50
```

Output:

```
{"data":{"columns":["id","name"],"records":[[1,"Internet"],[3,"Web development"]],"results":2}}
```

NB: Pages that are not ordered cannot be paginated.

### Create

You can easily add a record using the POST method (x-www-form-urlencoded, see rfc1738). The call returns the "last insert id".

```
POST http://dri.cloud.sushant.info.np/api.php/data
id=1&name=Internet
```

Output:

```
1
```

Note that the fields that are not specified in the request get the default value as specified in the database.

### Create (with JSON object)

Alternatively you can send a JSON object in the body. The call returns the "last insert id".

```
POST http://dri.cloud.sushant.info.np/api.php/data
{"id":1,"name":"Internet"}
```

Output:

```
1
```

Note that the fields that are not specified in the request get the default value as specified in the database.

### Create (with JSON array)

Alternatively you can send a JSON array containing multiple JSON objects in the body. The call returns an array of "last insert id" values. 

```
POST http://dri.cloud.sushant.info.np/api.php/data
[{"name":"Internet"},{"name":"Programming"},{"name":"Web development"}]
```

Output:

```
[1,2,3]
```

This call uses a transaction and will either insert all or no records. If the transaction fails it will return 'null'.

### Read

If you want to read a single object you can use:

```
GET http://dri.cloud.sushant.info.np/api.php/data/1
```

Output:

```
{"id":1,"name":"Internet"}
```

### Read (multiple)

If you want to read multiple objects you can use:

```
GET http://dri.cloud.sushant.info.np/api.php/data/1,2
```

Output:

```
[{"id":1,"name":"Internet"},{"id":2,"name":"Programming"}]
```

### Update

Editing a record is done with the PUT method. The call returns the number of rows affected.

```
PUT http://dri.cloud.sushant.info.np/api.php/data/2
name=Internet+networking
```

Output:

```
1
```

Note that only fields that are specified in the request will be updated.

### Update (with JSON object)

Alternatively you can send a JSON object in the body. The call returns the number of rows affected.

```
PUT http://dri.cloud.sushant.info.np/api.php/data/2
{"name":"Internet networking"}
```

Output:

```
1
```

Note that only fields that are specified in the request will be updated.

### Update (with JSON array)

Alternatively you can send a JSON array containing multiple JSON objects in the body. The call returns an array of the rows affected.

```
PUT http://dri.cloud.sushant.info.np/api.php/data/1,2
[{"name":"Internet"},{"name":"Programming"}]
```

Output:

```
[1,1]
```

The number of primary key values in the URL should match the number of elements in the JSON array (and be in the same order).

This call uses a transaction and will either update all or no records. If the transaction fails it will return 'null'.

### Delete

The DELETE verb is used to delete a record. The call returns the number of rows affected.

```
DELETE http://dri.cloud.sushant.info.np/api.php/data/2
```

Output:

```
1
```

### Delete (multiple)

The DELETE verb can also be used to delete multiple records. The call returns the number of rows affected for each primary key value specified in the URL.

```
DELETE http://dri.cloud.sushant.info.np/api.php/data/1,2
```

Output:

```
[1,1]
```

This call uses a transaction and will either delete all or no records. If the transaction fails it will return 'null'.

## Relations

The explanation of this feature is based on the data structure from the ```blog.sql``` database file. This database is a very simple blog data structure with corresponding foreign key relations between the tables. These foreign key constraints are required as the relationship detection is based on them, not on column naming.

You can get the "post" that has "id" equal to "1" with it's corresponding "data", "tags" and "comments" using:

```
GET http://dri.cloud.sushant.info.np/api.php/posts?include=data,tags,comments&filter=id,eq,1
```

Output:

```
{
    "posts": {
        "columns": [
            "id",
            "user_id",
            "category_id",
            "content"
        ],
        "records": [
            [
                1,
                1,
                1,
                "blog started"
            ]
        ]
    },
    "post_tags": {
        "relations": {
            "post_id": "posts.id"
        },
        "columns": [
            "id",
            "post_id",
            "tag_id"
        ],
        "records": [
            [
                1,
                1,
                1
            ],
            [
                2,
                1,
                2
            ]
        ]
    },
    "data": {
        "relations": {
            "id": "posts.category_id"
        },
        "columns": [
            "id",
            "name"
        ],
        "records": [
            [
                1,
                "anouncement"
            ]
        ]
    },
    "tags": {
        "relations": {
            "id": "post_tags.tag_id"
        },
        "columns": [
            "id",
            "name"
        ],
        "records": [
            [
                1,
                "funny"
            ],
            [
                2,
                "important"
            ]
        ]
    },
    "comments": {
        "relations": {
            "post_id": "posts.id"
        },
        "columns": [
            "id",
            "post_id",
            "message"
        ],
        "records": [
            [
                1,
                1,
                "great"
            ],
            [
                2,
                1,
                "fantastic"
            ]
        ]
    }
}
```

You can call the ```php_crud_api_tranform()``` function to structure the data hierarchical like this:

```
{
    "posts": [
        {
            "id": 1,
            "post_tags": [
                {
                    "id": 1,
                    "post_id": 1,
                    "tag_id": 1,
                    "tags": [
                        {
                            "id": 1,
                            "name": "funny"
                        }
                    ]
                },
                {
                    "id": 2,
                    "post_id": 1,
                    "tag_id": 2,
                    "tags": [
                        {
                            "id": 2,
                            "name": "important"
                        }
                    ]
                }
            ],
            "comments": [
                {
                    "id": 1,
                    "post_id": 1,
                    "message": "great"
                },
                {
                    "id": 2,
                    "post_id": 1,
                    "message": "fantastic"
                }
            ],
            "user_id": 1,
            "category_id": 1,
            "data": [
                {
                    "id": 1,
                    "name": "anouncement"
                }
            ],
            "content": "blog started"
        }
    ]
}
```

This transform function is available for PHP and JavaScript in the files ```php_crud_api_tranform.php``` and ```php_crud_api_tranform.js``` in the "lib" folder.

## Permissions

By default a single database is exposed with all it's tables and columns in read-write mode. You can change the permissions by specifying
a 'table_authorizer' and/or a 'column_authorizer' function that returns a boolean indicating whether or not the table or column is allowed
for a specific CRUD action.

## Record filter

By defining a 'record_filter' function you can apply a forced filter, for instance to implement roles in a database system.
The rule "you cannot view unpublished blog posts unless you have the admin role" can be implemented with this filter.

```
return ($table=='posts' && $_SESSION['role']!='admin')?array('published,nis,null'):false;
```

## Multi-tenancy

The 'tenancy_function' allows you to expose an API for a multi-tenant database schema. In the simplest model all tables have a column
named 'customer_id' and the 'tenancy_function' is defined as:

```
return $col=='customer_id'?$_SESSION['customer_id']:null
```

In this example ```$_SESSION['customer_id']``` is the authenticated customer in your API.

## Sanitizing input

By default all input is accepted and sent to the database. If you want to strip (certain) HTML tags before storing you may specify a
'input_sanitizer' function that returns the adjusted value.

## Validating input

By default all input is accepted. If you want to validate the input, you may specify a 'input_validator' function that returns a boolean
indicating whether or not the value is valid.

## Multi-Database

The code also supports multi-database API's. These have URLs where the first segment in the path is the database and not the table name.
This can be enabled by NOT specifying a database in the configuration. Also the permissions in the configuration should contain a dot
character to seperate the database from the table name. The databases 'mysql', 'information_schema' and 'sys' are automatically blocked.

## Atomic increment (for counters)

Incrementing a numeric field of a record is done with the PATCH method (non-numeric fields are ignored).
Decrementing can be done using a negative increment value.
To add '2' to the field 'visitors' in the 'events' table for record with primary key '1', execute:

```
PATCH http://dri.cloud.sushant.info.np/api.php/events/1
{"visitors":2}
```

Output:

```
1
```

The call returns the number of rows affected. Note that multiple fields can be incremented and batch operations are supported (see: update/PUT).

## Binary data

Binary fields are automatically detected and data in those fields is returned using base64 encoding.

```
GET http://dri.cloud.sushant.info.np/api.php/data/2
```

Output:

```
{"id":2,"name":"funny","icon":"ZGF0YQ=="}
```

When sending a record that contains a binary field you will also have to send base64 encoded data.

```
PUT http://dri.cloud.sushant.info.np/api.php/data/2
icon=ZGF0YQ
```

In the above example you see how binary data is sent. Both "base64url" and standard "base64" are allowed (see rfc4648).

## File uploads

You can also upload a file using a web form (multipart/form-data) like this:

```
<form method="post" action="http://dri.cloud.sushant.info.np/api.php/data" enctype="multipart/form-data">
  Select image to upload:
  <input type="file" name="icon">
  <input type="submit">
</form>
```

Then this is handled as if you would have sent:

```
POST http://dri.cloud.sushant.info.np/api.php/data
{"icon_name":"not.gif","icon_type":"image\/gif","icon":"ZGF0YQ==","icon_error":0,"icon_size":4}
```

As you can see the "xxx_name", "xxx_type", "xxx_error" and "xxx_size" meta fields are added (where "xxx" is the name of the file field).

NB: You cannot edit a file using this method, because browsers do not support the "PUT" method in these forms.

## Spatial/GIS support

There is also support for spatial filters:
  
  - sco: spatial contains (geometry contains another)
  - scr: spatial crosses (geometry crosses another)
  - sdi: spatial disjoint (geometry is disjoint from another)
  - seq: spatial equal (geometry is equal to another)
  - sin: spatial intersects (geometry intersects another)
  - sov: spatial overlaps (geometry overlaps another)
  - sto: spatial touches (geometry touches another)
  - swi: spatial within (geometry is within another)
  - sic: spatial is closed (geometry is closed and simple)
  - sis: spatial is simple (geometry is simple)
  - siv: spatial is valid (geometry is valid)

You can negate these filters as well by prepending a 'n' character, so that 'sco' becomes 'nsco'.

Example:

```
GET http://dri.cloud.sushant.info.np/api.php/countries?columns=name,shape&filter[]=shape,sco,POINT(30 20)
```

Output:

```
{"countries":{"columns":["name","shape"],"records":[["Italy","POLYGON((30 10,40 40,20 40,10 20,30 10))"]]}}
```

When sending a record that contains a geometry (spatial) field you will also have to send a WKT string.

```
PUT http://dri.cloud.sushant.info.np/api.php/users/1
{"location":"POINT(30 20)"}
```

In the above example you see how a [WKT string](https://en.wikipedia.org/wiki/Well-known_text) is sent.

## Unstructured data support

You may store JSON documents in JSON (MySQL), JSONB (PostgreSQL) or XML (SQL Server) field types in the database.
These documents have no schema. Whitespace in the structure is not maintained.

## Sending NULL

When using the POST method (x-www-form-urlencoded, see rfc1738) a database NULL value can be set using a parameter with the "__is_null" suffix:

```
PUT http://dri.cloud.sushant.info.np/api.php/data/2
name=Internet&icon__is_null
```

When sending JSON data, then sending a NULL value for a nullable database field is easier as you can use the JSON "null" value (without quotes).

```
PUT http://dri.cloud.sushant.info.np/api.php/data/2
{"name":"Internet","icon":null}
```

## Automatic fields

Before any operation the 'before' function is called that allows you to do set some automatic fields.
Note that the 'input' parameter is writable and is an object (or 'false' when it is missing or invalid).

## Soft delete

The 'before' function allows modification of the request parameters and can (for instance) be used to implement soft delete behavior.

```php
'before'=>function(&$cmd, &$db, &$tab, &$id, &$in) { 
	if ($cmd == 'delete') {
		$cmd = 'update'; // change command to update
		$in = (object)array('deleted' => date('Y-m-d H:i:s', time()));
	}
},
'column_authorizer'=>function($cmd, $db ,$tab, $col) { 
	return ( ! in_array($col, array('deleted')));
},
'record_filter'=>function($cmd,$db,$tab) { 
	return array('deleted,is,null');
}
```

## Custom actions

After any operation the 'after' function is called that allows you to do some custom actions.
Note that the output parameter is not filled for 'read' or 'list' operations due to the streaming nature of the API.

## Multi-domain CORS

By specifying `allow_origin` in the configuration you can control the `Access-Control-Allow-Origin` response header that is being sent.

If you set `allow_origin` to `*` the `Access-Control-Allow-Origin` response header will be set to `*`.
In all other cases the `Access-Control-Allow-Origin` response header is set to the value of the request header `Origin` when a match is found.
 
You may also specify `allow_origin` to `https://*.yourdomain.com` matching any host that starts with `https://` and ends on `.yourdomain.com`.

Multiple hosts may be specified using a comma, allowing you to set `allow_origin` to `https://yourdomain.com, https://*.yourdomain.com`.

## 64 bit integers in JavaScript

JavaScript does not support 64 bit integers. All numbers are stored as 64 bit floating point values. The mantissa of a 64 bit floating point
number is only 53 bit and that is why all integer numbers bigger than 53 bit may cause problems in JavaScript.

## Errors

The following types of 404 'Not found' errors may be reported:

  - entity (could not find entity)
  - object (instance not found on read)
  - input (instance not found on create)
  - subject (instance not found on update)
  - 1pk (primary key not found or composite)


## Debugging

If you have trouble getting the file to work you may want to check the two environment variables used. Uncomment the following line:

```
var_dump($_SERVER['REQUEST_METHOD'],$_SERVER['PATH_INFO']); die();
```

And then visit:

```
http://dri.cloud.sushant.info.np/api.php/posts
```

This should output:

```
string(3) "GET"
string(6) "/posts"
```
