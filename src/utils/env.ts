let domain = document.domain
let BASE_URL = ''
switch (domain) {
	case 'admin.51jiaoxi.com':
		BASE_URL = '//www.51jiaoxi.com'
		break
	case 'admin.test.51jiaoxi.com':
		BASE_URL = '//test.51jiaoxi.com'
		break
	case 'admin.jiaoxi.com':
		BASE_URL = '//jiaoxi.com'
		break
	default:
		BASE_URL = '//test.51jiaoxi.com'
		// BASE_URL = '//jiaoxi.com'
		break
}
export const $BASE_URL = BASE_URL
