<script>
    const md5 = require("md5");

    function buildMd5(obj) {
        var arr = [];

        _.forOwn(obj, function (value, key) {
            arr.push(`${key}${value}`);
        });

        var string = "";

        _.forEach(arr, (el) => {
            string += el;
        });

        string = `${appSecret}${string}${appSecret}`;

        var result = md5(string);

        return result;
    }

    function refreshToken() {
        //-- object must be alphabetically sorted

        var data = {
            app_key: appKey,

            expires_in: 7200,

            format: format,

            method: getTokenMethod,

            sign_method: signMethod,

            timestamp: moment().utc().format("yyyy-MM-DD HH:mm:ss"),

            user_id: userId,

            user_pwd_md5: userPwdMd5,

            v: "1.0",
        };

        var md5 = buildMd5(data);

        data.sign = md5;

        data = qs.stringify(data);

        return axios({
            method: "POST",

            url: jimiUri,

            headers: {
                "content-type":
                    "application/x-www-form-urlencoded; charset=utf-8",
            },

            data: data,
        })
            .then((response) => {
                if (response.data.code !== 0) {
                    return Promise.reject(new Error(response.data.message));
                }

                return Promise.resolve(response.data.result);
            })

            .catch((error) => {
                console.log(error);

                return Promise.resolve(error);
            });
    }
</script>
