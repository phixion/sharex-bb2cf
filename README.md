WIP

## **what we need:**

- free plan: [cloudflare](https://www.cloudflare.com) dns with a domain of yours parked on it
- free plan: [BackBlaze B2](https://www.backblaze.com/) for up to 10GB of storage buckets
- and, yeah ...[ShareX](https://github.com/ShareX/ShareX)

## **what we want**

- a simple and relyable way to take care of your daily screenshot/screenshare/fileshare foo
- I'm assuming sharex is already in use as I will not go through capture and processing parts of it, just the upload and actual share
- leverage our own domain-name in the sharing link

## **what we do**

1.  find out your BB details and spawn the filebucket create api credentials
2.  setup sharex and upload a file to reveal our backblaze details
3.  setup the domain
4.  setup a worker script to utilize cdn and shorten our url

    ## 1. BackBlaze

    create a Bucket that publicly accessible give it a namethat makes sense
    ![enter image description here](https://i.phx.ms/ixj3.png)

    create api credentials for sharex with read/write permissions to that bucket
    ![enter image description here](https://i.phx.ms/4Vix.png)


    ## 2. ShareX
    setup a new destination from thepresets and put the credentials we just received

    ![enter image description here](https://i.phx.ms/fQES.png)

    set it up as your default and upload a testfile to see if the credentials work and have sufficiant permissions

    if that all worked head back to BB2 and check the filedetails of the upload as it will reveal the hostname we need for our dns setup withing cloudflare

    I put the interesting parts in red -> f000l.backblazeb2.com is our cname hostname

    ![enter image description here](https://i.phx.ms/rGSi.png)


    ## 3. CloudFlare DNS  setup
    head over to cloudflare and setup a cname record that points to backblaze, something like this
    ![enter image description here](https://i.phx.ms/QPIU.png)
