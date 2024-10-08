import { IPayload } from '@modules/token/interfaces.token';
import tokenTypes from '@modules/token/types.token';
import USER from '@modules/user/model.user';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import config from '../../config/config';

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: IPayload, done) => {
    try {
      if (payload.type !== tokenTypes.ACCESS) {
        throw new Error('Invalid token type');
      }
      const user = await USER.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
