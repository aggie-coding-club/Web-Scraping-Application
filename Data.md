# MongoDB

## Metadata

```json
{
  "_id": ObjectId("unique_metadata_id"),
  "name": "Ryan Trahan",
  "note": "Lorem ipsum dolor sit...",
  "status": "Success",
  "url": "www.awesomeness.com",
  "lastScraped": "233455",
  "interval": 60,
  "selectors": [
    {
      "name": "sub count",
      "selector": "yt-formatted-string#sub-count",
      "objectId": ObjectId("selectorData_id1")
    },
    {
      "name": "view count",
      "selector": "yt-formatted-string#view-count",
      "objectId": ObjectId("selectorData_id2")
    }
  ]
}
```

## Selector Data

```json
{
  "_id": ObjectId("selectorData_id1"),
  "metadataId": ObjectId("unique_metadata_id"),
  "name": "sub count",
  "selector": "yt-formatted-string#sub-count",
  "data": [
    {
      "timestamp": "2235",
      "value": "50,123 subscribers"
    },
    {
      "timestamp": "2235",
      "value": "50,123 subscribers"
    },
    {
      "timestamp": "2235",
      "value": "50,123 subscribers"
    }
  ]
}
```

```json
{
  "_id": ObjectId("selectorData_id2"),
  "metadataId": ObjectId("unique_metadata_id"),
  "name": "view count",
  "selector": "yt-formatted-string#view-count",
  "data": [
    {
      "timestamp": "2235",
      "value": "50,123 views"
    },
    {
      "timestamp": "2235",
      "value": "50,123 views"
    },
    {
      "timestamp": "2235",
      "value": "50,123 views"
    }
  ]
}
```

# JSON download

```json
[
  {
    "name": "Ryan Trahan",
    "note": "Lorem ipsum dolor sit...",
    "status": "Success",
    "url": "www.awesomeness.com",
    "lastScraped": "233455",
    "interval": 60,
    "selectors": [
      {
        "name": "sub count",
        "selector": "yt-formatted-string#sub-count",

        "data": [
          {
            "timestamp": "2235",
            "value": "50,123 subscribers"
          },
          {
            "timestamp": "2235",
            "value": "50,123 subscribers"
          },
          {
            "timestamp": "2235",
            "value": "50,123 subscribers"
          }
        ]
      },
      {
        "name": "view count",
        "selector": "yt-formatted-string#view-count",

        "data": [
          {
            "timestamp": "2235",
            "value": "50,123 views"
          },
          {
            "timestamp": "2235",
            "value": "50,123 views"
          },
          {
            "timestamp": "2235",
            "value": "50,123 views"
          }
        ]
      }
    ]
  }
]
```
