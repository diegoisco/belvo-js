import Resource from './resources';
import { encodeFileB64 } from './utils';

/**
 * A Link is a set of credentials associated to a end-user access to an Institution.
 * @extends Resource
 * */
class Link extends Resource {
  /**
   * Links endpoint.
   * @private
   */
  #endpoint = 'api/links/';

  /**
   * @constant {string}
   * @static
   * */
  static SINGLE = 'single';

  /**
   * @constant {string}
   * @static
   */
  static RECURRENT = 'recurrent';

  /**
   * Register a new link.
   * @async
   * @param {string} institution - Institution's code.
   * @param {string} username - Username used to sign in online by the end-user.
   * @param {string} password - Password used to sign in online by the end-user.
   * @param {object} options - Optional parameters
   *   (token, encryptionKey, usernameType, username2, username3, password2, accessMode,
   *    certificate, privateKey).
   * @returns {object} Newly created link.
   * @throws {RequestError}
   */
  async register(
    institution, username, password, options = {},
  ) {
    const {
      token, encryptionKey, usernameType, username2, username3, password2, accessMode,
    } = options;
    let {
      certificate, privateKey,
    } = options;
    certificate = certificate ? encodeFileB64(certificate) : certificate;
    privateKey = privateKey ? encodeFileB64(privateKey) : privateKey;
    const result = await this.session.post(
      this.#endpoint, {
        institution,
        username,
        username2,
        username3,
        password,
        password2,
        token,
        encryption_key: encryptionKey,
        access_mode: accessMode,
        username_type: usernameType,
        certificate,
        private_key: privateKey,
      },
    );
    return result;
  }

  /**
   * Update link's password and password2.
   * Use this function when you want to update the link credentials.
   * Only updating passwords is available.
   * @async
   * @param {string} id - UUID4 representation of the link Id.
   * @param {string} password - New password.
   * @param {object} options - Optional parameters
   *  (token, encryptionKey, password2, usernameType, certificate, privateKey).
   * @returns {object} Response
   * @throws {RequestError}
   */
  async update(id, options = {}) {
    const {
      token, encryptionKey, password, password2, usernameType,
    } = options;
    let {
      certificate, privateKey,
    } = options;
    certificate = certificate ? encodeFileB64(certificate) : certificate;
    privateKey = privateKey ? encodeFileB64(privateKey) : privateKey;
    const result = await this.session.put(this.#endpoint, id, {
      password,
      password2,
      token,
      encryption_key: encryptionKey,
      username_type: usernameType,
      certificate,
      private_key: privateKey,
    });
    return result;
  }

  /**
   * Request scoped tokens to operate with a single link
   * @async
   * @param {string} id - UUID4 representation of the link Id.
   * @param {string} scopes - List of comma separated scopes
   * @returns {object} Response
   * @throws {RequestError}
   */
  async token(id, scopes) {
    return this.session.post('api/token/', { link_id: id, scopes });
  }
}

export default Link;
