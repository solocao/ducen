import glob from 'glob';
import { EventBus } from '../../../contexts/shared/domain/DomainEvents/EventBus';
import { Repository } from '../../../contexts/shared/domain/Repositories/Repository';
import { DomainEventSubscriber } from '../../../contexts/shared/domain/DomainEvents/DomainEventSubscriber';


const subscribers = new Array<DomainEventSubscriber>();

export function registerObservers(repo: Repository,bus: EventBus) {
    const routes = glob.sync(__dirname + '/**/*.observe.*');
    routes.map(route => register(route, repo, bus));
    bus.addSubscribers(subscribers);
}

function register(routePath: string,repo: Repository, bus:EventBus) {
    const route = require(routePath);
    const subscriber = route.register(repo, bus);
    subscribers.push(subscriber);
}